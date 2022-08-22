const express = require("express");
const productController = require("../controllers/productController");
const authenticate = require("../middlewares/authenticate");
const { imageUpload } = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/",
  authenticate,
  imageUpload.array("images", 5),
  productController.createProduct
);
router
  .route("/:productId")
  .get(productController.getProduct)
  .patch(authenticate, productController.updateProduct);

module.exports = router;
