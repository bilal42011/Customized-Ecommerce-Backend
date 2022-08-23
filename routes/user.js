const express = require("express");
const authenticate = require("../middlewares/authenticate");
const userController = require("../controllers/userController");
const { imageUpload } = require("../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .get(authenticate, userController.getInfo)
  .patch(authenticate, imageUpload.single("avatar"), userController.patchUser);
router.post("/upgrade", authenticate, userController.upgradeAccount);
router.get("/buyer-requests", authenticate, userController.getBuyerRequets);
router.get("/chats", authenticate, userController.getChats);
router.get("/public/:userId", userController.getUserInfo);
router.get("/public/:userId/products", userController.getProducts);

module.exports = router;
