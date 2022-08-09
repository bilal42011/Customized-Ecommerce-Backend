const express = require("express");
const { authenticate } = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(authenticate, userController.getSelfInfo)
  .patch(authenticate, userController.patchUser);

router.get("/:userId", userController.getUserInfo);

module.exports = router;
