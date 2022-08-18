const express = require("express");
const proposalsRouter = require("./proposals");
const controller = require("../../controllers/buyerRequetsController");
const authenticate = require("../../middlewares/authenticate");
const { attachmentUpload } = require("../../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .get(authenticate, controller.getBuyerRequestsByCategory)
  .post(
    authenticate,
    attachmentUpload.array("files", 5),
    controller.createBuyerRequest
  );
router.get("/:requestId", controller.getBuyerRequest);

router.use("/:requestId/proposals", proposalsRouter);

module.exports = router;
