const express = require("express");
const proposalsRouter = require("./proposals/proposals");
const controller = require("../../controllers/buyerRequetsController");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(authenticate, controller.getBuyerRequests)
  .post(authenticate, controller.createBuyerRequest);
router.get("/:requestId", controller.getBuyerRequest);

router.use("/:requestId/proposals", proposalsRouter);

module.exports = router;
