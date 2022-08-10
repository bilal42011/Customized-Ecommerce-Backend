const express = require("express");
const orderController = require("../controllers/orderController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", authenticate, orderController.createOrder);
router
  .route("/:orderId")
  .get(authenticate, orderController.getOrder)
  .delete(authenticate, orderController.cancelOrder);

module.exports = router;
