const User = require("./../models/userModel");
const {
  asyncHandler,
  CustomError,
  jwtTokenGenerator,
} = require("./../utils/lib");

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

exports.login = asyncHandler(async function (req, res, next) {
  const { email, password } = req.body;

  // validate request for email and password
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
