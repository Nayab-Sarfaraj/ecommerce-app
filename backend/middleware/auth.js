const User = require("../models/userSchema");
const ErrorHandler = require("../utils/Errorhandler");
const jwt = require("jsonwebtoken");

const isAuthenticated = async function (req, res, next) {
  try {
    // Access cookies from the request object (req.cookies)
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      throw new Error("Token not found");
    }

    // Verify the token
    const decodedData = await jwt.verify(token, process.env.SECRET_KET);

    // Log decoded data
    req.user = await User.findById(decodedData._id);

    // Call next middleware
    next();
  } catch (error) {
    // Handle errors
    return next(new ErrorHandler(error.message, 401));
  }
};

const authenticateRole = function (...roles) {
  try {
    return (req, res, next) => {
      console.log(req.user.role);
      if (!roles.includes(req.user.role)) {
        next(
          new ErrorHandler(
            `Role ${req.user.role} is not authorized to access this resource`
          )
        );
      }
      next();
    };
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
};

module.exports = {
  isAuthenticated,
  authenticateRole,
};
