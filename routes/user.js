const express = require("express");
const authenticate = require("../middlewares/authenticate");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(authenticate, userController.getInfo)
  .patch(authenticate, userController.patchUser);
router.get("buyer-requets", authenticate, userController.getBuyerRequets);
router.get("chats", authenticate, userController.getChats);
router.get("orders", authenticate, userController.getOrders);

router.get("/:userId", userController.getUserInfo);
router.get("/:userId/products", userController.getProducts);

module.exports = router;
