const router = require("express").Router();
const { compareSync } = require("bcrypt");
const User = require("../models/userSchema");
const saveToken = require("../utils/jwtToken");
const Errorhandler = require("../utils/Errorhandler");
const userController = require("../controllers/UserController");
const { isAuthenticated } = require("../middleware/auth");
const { authenticateRole } = require("../middleware/auth");
router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/me", isAuthenticated, userController.getUserProfile);
router.post("/update/password", isAuthenticated, userController.updatePassword);
router.get(
  "/admin/users",
  isAuthenticated,
  authenticateRole("admin"),
  userController.getAllUsers
);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, authenticateRole("admin"), userController.getUserInfo)
  .post(
    isAuthenticated,
    authenticateRole("admin"),
    userController.updateUserRole
  )
  .delete(
    isAuthenticated,
    authenticateRole("admin"),
    userController.deleteUser
  );
module.exports = router;
