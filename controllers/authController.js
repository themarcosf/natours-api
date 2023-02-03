const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const {
  CustomError,
  asyncHandler,
  emailHandler,
  setupResponse,
} = require("./../utils/lib");
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * signup middleware :
 * validation is done directly in the model
 * and a JWT token is returned to the client
 */
exports.signup = asyncHandler(async function (req, res, next) {
  const _user = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  setupResponse(_user, 201, res);
});
////////////////////////////////////////////////////////////////////////////////////////////////

/** login middleware : validation is done in the function and JWT token returned to client */
exports.login = asyncHandler(async function (req, res, next) {
  const { email, password } = req.body;

  /** validate email and password from request */
  if (!email || !password)
    return next(new CustomError("Email or password not provided", 401));

  /** validate user credentials */
  const _user = await User.findOne({ email }).select("+password");
  if (!_user || !(await _user.validatePassword(password, _user.password)))
    return next(new CustomError("Incorrect email or password", 401));

  setupResponse(_user, 200, res);
});

/** enable rendering conditional frontend assets */
exports.checkLogin = async function (req, res, next) {
  try {
    /** check request for token cookie */
    if (!req.cookies.jwt) return next();

    /** validate token integrity */
    const _payload = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    /** verify user status */
    const _user = await User.findById(_payload.id)
      .select("+photo")
      .select("+status")
      .select("+passwordTimestamp");
    if (!_user || _user.status === "inactive") return next();

    /** check if current password matches token */
    if (await _user.validateTokenTimestamp(_payload.iat)) return next();

    /**
     * res.locals : set variables accessible in templates rendered with res.render
     * variables are available within a single req-res cycle, and will not be shared between requests
     */
    res.locals.user = _user;
    next();
  } catch (err) {
    return next();
  }
};

/** logout middleware : empty jwt with minimum expiration time sent to client in place of original jwt */
exports.logout = function (req, res) {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 500),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" }).end();
};
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * authentication middleware : handles authentication before routes access
 * authorization middleware : handles authorization to specific routes by certain users eg admin
 *
 * PROMISIFY (fn) : node built-in method to avoid callback pattern in async/await functions
 */
exports.authenticate = asyncHandler(async function (req, res, next) {
  const _error = new CustomError("Authentication failed", 401);

  /** check request for authorization token */
  if (!req.cookies.jwt && !req.headers.authorization.startsWith("Bearer"))
    return next(_error);

  const token = req.cookies.jwt
    ? req.cookies.jwt
    : req.headers.authorization.split(" ")[1];

  /** validate token integrity */
  const _payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  /** verify user status */
  const _user = await User.findById(_payload.id)
    .select("+status")
    .select("+passwordTimestamp")
    .select("+role");

  if (!_user || _user.status === "inactive") return next(_error);

  /** check if current password matches token */
  if (await _user.validateTokenTimestamp(_payload.iat)) return next(_error);

  // attach user data to request
  req.user = _user;
  next();
});

/**
 * PASSING ARGUMENTS INTO MIDDLEWARE FUNCTIONS
 *
 * 1. create wrapper function that returns middleware function
 * 2. middleware gets access to wrapper function parameters due to closure
 */
exports.authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new CustomError("Authorization failed", 403));

    next();
  };
};
////////////////////////////////////////////////////////////////////////////////////////////////

/** Password management middleware */
exports.forgotPassword = asyncHandler(async function (req, res, next) {
  /** get user based on email */
  const _user = await User.findOne({ email: req.body.email });
  if (!_user) return next(new Error("Email not found", 404));

  /** generate random reset token and save */
  const _resetToken = _user.generatorPasswordResetToken();
  await _user.save({ validateBeforeSave: false });

  /** send email to user with token */
  try {
    const _resetUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v1/users/resetPassword/${_resetToken}`;
    await emailHandler({
      email: _user.email,
      subject: "Reset password",
      message: `Click the link to reset password: ${_resetUrl}`,
    });

    res
      .status(200)
      .send({
        status: "success",
      })
      .end();
  } catch (err) {
    _user.passwordResetToken = undefined;
    _user.passwordResetExpires = undefined;
    await _user.save({ validateBeforeSave: false });

    return next(new CustomError("Error sending email.", 500));
  }
});

exports.resetPassword = asyncHandler(async function (req, res, next) {
  /** get user based on token and check if token is expired */
  const _hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const _user = await User.findOne({
    passwordResetToken: _hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!_user) return next(new CustomError("Invalid token", 400));

  /** updated password */
  _user.password = req.body.password;
  _user.passwordConfirm = req.body.passwordConfirm;
  _user.passwordResetToken = undefined;
  _user.passwordResetExpires = undefined;
  await _user.save();

  setupResponse(_user, 200, res);
});

/** security best practice: require and verify current password before update */
exports.updatePassword = asyncHandler(async function (req, res, next) {
  /** get user from collection */
  const _user = await User.findById(req.user._id).select("+password");

  /** verify posted current password */
  if (
    !(await _user.validatePassword(req.body.passwordCurrent, _user.password))
  ) {
    return next(new CustomError("Incorrect password", 401));
  }

  /** update password */
  _user.password = req.body.password;
  _user.passwordConfirm = req.body.passwordConfirm;
  await _user.save();

  setupResponse(_user, 200, res);
});
