const { isAuthenticated, authenticateRole } = require("../middleware/auth");
const Order = require("../models/OrderSchema");
const orderController = require("../controllers/OrderController");
const router = require("express").Router();

router.post("/order/new", isAuthenticated, orderController.creatrOrder);
router.get("/order/me", isAuthenticated, orderController.getLoggedInUserOrder);
router.get("/order/:id", orderController.getSingleOrder);

// update order status
// router.
router
  .route("/admin/order/:id")
  .patch(
    isAuthenticated,
    authenticateRole("admin"),
    orderController.updateStatus
  )
  .delete(
    isAuthenticated,
    authenticateRole("admin"),
    orderController.deleteOrder
  );

router.get(
  "/admin/order",
  isAuthenticated,
  authenticateRole("admin"),
  orderController.getAllOrders
);

module.exports = router;
