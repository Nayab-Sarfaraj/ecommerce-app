const { default: mongoose } = require("mongoose");
// const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, "Name should be at least 2 character long"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exist ,try using another one"],
  },
  password: {
    type: String,
    required: [true, "Please enter passwrod"],
    minlength: [2, "password shold be 2 chracter long"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("hashing password two  ",this.password);
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_KET, {
    expiresIn: "1w",
  });
};
userSchema.methods.comparePassword = async function (inputPassword) {
  console.log(inputPassword);
  console.log(this.password);
  const result = await bcrypt.compare(inputPassword, this.password);
  return result;
};

const User = mongoose.model("people", userSchema);
module.exports = User;
