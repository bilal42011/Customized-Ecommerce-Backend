const express = require("express");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

router.post("/", authenticate, chatController.createChat);
router
  .route("/:chatId")
  .get(authenticate, chatController.getMessages)
  .post(authenticate, chatController.addMessage);

module.exports = router;
