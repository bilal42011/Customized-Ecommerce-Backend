const express = require("express");
const authController = require("../controllers/authController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/signup", upload.single("avatar"), authController.signUp);
router.post("/login", authController.login);

module.exports = router;
