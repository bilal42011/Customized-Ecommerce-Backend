const express = require("express");

const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/", cartController.calculate);

module.exports = router;
