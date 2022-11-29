const User = require("./../models/userModel");
const { asyncHandler } = require("./../utils/lib");

exports.signup = asyncHandler(async function (req, res, next) {
  const _user = await User.create(req.body);

  res
    .status(201)
    .json({
      status: "success",
      data: {
        user: _user,
      },
    })
    .end();
});
