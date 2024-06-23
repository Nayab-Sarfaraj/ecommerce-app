const Product = require("../models/ProductSchema");
const router = require("express").Router();
const productController = require("../controllers/ProductController");
const upload = require("../middleware/multer")

const { isAuthenticated, authenticateRole } = require("../middleware/auth");
router.get("/admin/product", productController.getAllPrdAdmin);

router
  .post(
    "/product/new",
    isAuthenticated,
    authenticateRole("admin"),
    upload.array("images", 5),
    productController.createNewProduct
  )
  .get("/product", productController.getAllProducts);
router
  .get("/product/:id", productController.getSingleProduct)
  .delete(
    "/product/:id",
    isAuthenticated,
    authenticateRole("admin"),
    productController.deleteProduct
  )
  .patch(
    "/product/:id",
    isAuthenticated,
    authenticateRole("admin"),
    productController.updateProduct
  );

router
  .route("/review")
  .post(isAuthenticated, productController.createProductReview);

router
  .route("/reviews")
  .get(isAuthenticated, productController.getAllReviews)
  .delete(isAuthenticated, productController.deleteReview);

module.exports = router;
