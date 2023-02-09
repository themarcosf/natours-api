/**
 * IMPORTANT CAVEAT ABOUT MONGOOSE
 * CUSTOM DATA VALIDATORS and DOCUMENT MIDDLEWARE
 *
 * inside validator functions and document middleware the THIS
 * keyword is only gonna point to the current document when a NEW
 * document is being created ie POST requests .save() or .create()
 *
 * that is not true when UPDATING a document ie PATCH requests .update()
 */

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

/** mongoose format: BSON */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [5, "lengthmin is 5 digits"],
      maxlength: [40, "lengthmax is 40 digits"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      minlength: [10, "lengthmin is 10 digits"],
      maxlength: [30, "lengthmax is 30 digits"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "email is invalid"],
    },
    photo: { type: String, default: "default.jpg", select: false },
    status: {
      type: String,
      default: "active",
      enum: {
        values: ["active", "inactive"],
        message: "Invalid status",
      },
      select: false,
    },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "guide", "lead-guide", "admin"],
        message: "Invalid user role",
      },
      select: false,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "lengthmin is 8 digits"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "passwordConfirm is required"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Invalid password",
      },
      select: false,
    },
    passwordTimestamp: { type: Date, default: Date.now(), select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    active: { type: Boolean, default: true, select: false },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Query middleware
 * regex /^param/ : any expression starting with param
 */
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Encryption middleware using document pre-hooks
 *
 * Middlewares:
 * types: document, query, aggregation, model
 * pre-hooks: triggered before the event command
 * post-hooks: triggered after the event command
 *
 * CAVEAT: document middlewares are used for .save() or .create()
 *         they do NOT work for .update() functions
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  /**
   * in practice, saving to database can be slower than creating new JWT and
   * may result in changed password's timestamp being set 'after' JWT creation
   * making it so the user could not login using the new token
   * QUICK HACK : subtract 1 second from password timestamp
   */
  this.passwordTimestamp = Date.now() - 1000;
  next();
});
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Instance methods: available in all collection documents
 *
 * validatePassword: check if given password is equal to stored password
 * validateTokenTimestamp: check if password was modified after token creation
 * generatorPasswordResetToken: create new token used to reset password
 */
userSchema.methods.validatePassword = async function (
  givenPassword,
  storedPassword
) {
  return await bcrypt.compare(givenPassword, storedPassword);
};

userSchema.methods.validateTokenTimestamp = function (tknTimestamp) {
  return tknTimestamp < Math.floor(this.passwordTimestamp.getTime() / 1000);
};

userSchema.methods.generatorPasswordResetToken = function () {
  /** create simple reset token */
  const _resetToken = crypto.randomBytes(32).toString("hex");

  /** hash reset token before storage */
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(_resetToken)
    .digest("hex");

  /** set reset token expiration to 10 minutes */
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  /** return plaintext token */
  return _resetToken;
};

//////////////////////////////////////////////////////////////////////////////////////

const User = new mongoose.model("User", userSchema);

module.exports = User;
