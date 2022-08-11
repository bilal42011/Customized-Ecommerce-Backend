const express = require("express");
const authController = require("../controllers/authController");
const { imageUpload } = require("../middlewares/upload");

const router = express.Router();

router.post("/signup", imageUpload.single("avatar"), authController.signUp);
router.post("/login", authController.login);

module.exports = router;
