const express = require("express");
const orderController = require("../controllers/orderController");
const authenticate = require("../middlewares/authenticate");
const { attachmentUpload } = require("../middlewares/upload");

const router = express.Router();

router.post("/", authenticate, orderController.createOrder);
router.get("/as-seller", authenticate, orderController.getOrdersAsSeller);
router.get("/as-buyer", authenticate, orderController.getOrdersAsBuyer);
router.route("/:orderId").get(authenticate, orderController.getOrder);

router.get("/:orderId/approve", authenticate, orderController.approveOrder);
router.get("/:orderId/decline", authenticate, orderController.declineOrder);

router.post(
  "/:orderId/deliver",
  authenticate,
  attachmentUpload.array("files", 3),
  orderController.deliverOrder
);

router.patch("/:orderId/cancel", authenticate, orderController.cancelOrder);

router.patch(
  "/:orderId/cancel-confirm",
  authenticate,
  orderController.cancelConfirm
);

module.exports = router;
