const Errorhandler = require("../utils/Errorhandler");
module.exports = async (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.status = err.status || 500;

  return res.json({
    success: false,
    message: err.message,
  });
};
