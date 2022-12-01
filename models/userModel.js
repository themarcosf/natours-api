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
const mongoose = require("mongoose");
const validator = require("validator");

// mongoose format: BSON
const userSchema = new mongoose.Schema({
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
  photo: {
    type: String,
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
});
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Encryption middleware using document pre-hooks
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Instance method: available in all documents of its collection
 * checks if a given password is the same as the one stored in the document
 */
userSchema.methods.validatePassword = async function (
  givenPassword,
  storedPassword
) {
  return await bcrypt.compare(givenPassword, storedPassword);
};
//////////////////////////////////////////////////////////////////////////////////////

const User = new mongoose.model("User", userSchema);

module.exports = User;
