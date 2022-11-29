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
  photo: String,
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "lengthmin is 8 digits"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "passwordConfirm is required"],
  },
});
//////////////////////////////////////////////////////////////////////////////////////

const User = new mongoose.model("User", userSchema);

module.exports = User;
