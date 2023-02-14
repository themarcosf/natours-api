const multer = require("multer");
const sharp = require("sharp");

const handler = require("./../utils/factoryHandlers");
const User = require("./../models/userModel");
const { CustomError, asyncHandler, filterData } = require("../utils/lib");
////////////////////////////////////////////////////////////////////////

/** CURRENT USER middleware */
exports.readCurrentUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateCurrentUser = asyncHandler(async function (req, res, next) {
  /** create error if attempt to update password */
  if (req.body.password || req.body.passwordConfirm) {
    return next(new CustomError("Attempted to update password", 400));
  }

  /** filter user-provided data fields */
  const _filteredData = filterData(req.body, "name", "email");
  if (req.file) _filteredData.photo = req.file.filename;

  /** update user document */
  const _updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    _filteredData,
    {
      new: true,
      runValidators: true,
    }
  ).select("+photo");

  res
    .status(200)
    .json({
      status: "success",
      data: {
        user: _updatedUser,
      },
    })
    .end();
});

exports.deleteCurrentUser = asyncHandler(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, {
    status: "inactive",
    active: false,
  });

  res
    .status(204)
    .json({
      status: "success",
      data: null,
    })
    .end();
});
////////////////////////////////////////////////////////////////////////

/**
 * EXAMPLE : config multer upload middleware to save image to disk
 *
 * const multerStorage = multer.diskStorage({
 *   destination: (req, file, cb) => {
 *     cb(null, "public/img/users");
 *   },
 *   filename: (req, file, cb) => {
 *     const ext = file.mimetype.split("/")[1];
 *     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
 *   },
 * });
 */

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new CustomError("Not an image! Please upload only images.", 400), false);
  }
};

const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

/**
 * upload single image to single field : multerUpload.single() -> req.file
 * upload multiple images to single field : multerUpload.array() -> req.files
 * upload multiple images to multiple fields : multerUpload.fields() -> req.files
 */
exports.uploadSingleImage = multerUpload.single("photo");

exports.resizeSingleImage = asyncHandler(async function (req, res, next) {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  /** image processing to thumbnail */
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});
////////////////////////////////////////////////////////////////////////

/** CRUD handlers */
exports.getUser = handler.readOne(User);
exports.getAllUsers = handler.readAll(User);
exports.updateUser = handler.updateOne(User);
exports.deleteUser = handler.deleteOne(User);
