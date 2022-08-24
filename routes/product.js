const express = require("express");
const productController = require("../controllers/productController");
const authenticate = require("../middlewares/authenticate");
const { imageUpload } = require("../middlewares/upload");

const router = express.Router();

router.get("/", productController.getProducts);

router.post(
  "/",
  authenticate,
  imageUpload.array("images", 5),
  productController.createProduct
);
router
  .route("/:productId")
  .get(productController.getProduct)
  .patch(authenticate, productController.updateProduct)
  .delete(authenticate, productController.deleteProduct);

module.exports = router;
