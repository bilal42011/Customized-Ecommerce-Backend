const express = require("express");
const authenticate = require("../middlewares/authenticate");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(authenticate, userController.getInfo)
  .patch(authenticate, userController.patchUser);
router.post("/upgrade", authenticate, userController.upgradeAccount);
router.get("/buyer-requests", authenticate, userController.getBuyerRequets);
router.get("/chats", authenticate, userController.getChats);
router.get("public/:userId", userController.getUserInfo);
router.get("public/:userId/products", userController.getProducts);

module.exports = router;
