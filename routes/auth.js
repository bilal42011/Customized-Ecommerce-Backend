const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const { imageUpload } = require("../middlewares/upload");

const router = express.Router();

router.post("/signup", imageUpload.single("avatar"), authController.signUp);
router.post("/login", authController.login);
router.post("/code", authenticate, authController.verifyAccount);

module.exports = router;
