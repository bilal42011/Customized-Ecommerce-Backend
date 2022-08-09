const express = require("express");
const productController = require("../controllers/productController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

router.post("/", authenticate, productController.createProduct);
router
  .route("/:productId")
  .get(productController.getProduct)
  .patch(authenticate, productController.updateProduct);

router.module.exports = router;
