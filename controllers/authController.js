const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const {
  asyncHandler,
  CustomError,
  jwtTokenGenerator,
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
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res
    .status(201)
    .json({
      status: "success",
      token: jwtTokenGenerator(_user._id),
      data: {
        name: _user.name,
        email: _user.email,
      },
    })
    .end();
});
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * login middleware :
 * validation is done in the function
 * and a JWT token is returned to the client
 */
exports.login = asyncHandler(async function (req, res, next) {
  const { email, password } = req.body;

  // validate email and password from request
  if (!email || !password)
    return next(new CustomError("Email or password not provided", 400));

  // validate user credentials
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.validatePassword(password, user.password)))
    return next(new CustomError("Incorrect email or password", 400));

  res
    .status(200)
    .json({
      status: "sucess",
      token: jwtTokenGenerator(user._id),
      data: {
        name: user.name,
        email: user.email,
      },
    })
    .end();
});
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * protect middleware :
 * handles authorization before routes access
 *
 * EXPLANATION :
 * promisify(fn) : node built-in method to avoid callback pattern in async/await functions
 */
exports.protect = asyncHandler(async function (req, res, next) {
  const _error = new CustomError("Authorization failed", 401);
  // check headers for authorization token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) return next(_error);

  const token = authHeader.split(" ")[1];

  // validate token integrity
  const _payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // verify user status
  const _user = await User.findById(_payload.id)
    .select("+status")
    .select("+passwordTimestamp");

  if (!_user || _user.status === "inactive") return next(_error);

  // check if current password matches token
  if (await _user.validateTokenTimestamp(_payload.iat)) return next(_error);

  // attach user data to request
  req.user = _user;
  next();
});
