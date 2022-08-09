const express = require("express");

const router = express.Router();

router.post("/", authenticate, orderController.createOrder);
router
  .route("/:orderId")
  .get(authenticate, orderController.getOrder)
  .delete(authenticate, orderController.cancelOrder);

module.exports = router;
