const express = require("express");
const proposalsRouter = require("./proposals/proposals");
const { authenticate } = require("../../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authenticate, controller.getBuyerRequets)
  .post(authenticate, controller.createBuyerRequest);
router.get("/:requestId", controller.getBuyerRequest);

router.use("/:requestId/proposals", proposalsRouter);

module.exports = router;
