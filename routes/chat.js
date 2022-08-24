const express = require("express");
const chatController = require("../controllers/chatController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", authenticate, chatController.createChat);
router.get("/users/:userId", authenticate, chatController.getUserChat);
router
  .route("/:chatId")
  .get(authenticate, chatController.getMessages)
  .post(authenticate, chatController.addMessage);

module.exports = router;
