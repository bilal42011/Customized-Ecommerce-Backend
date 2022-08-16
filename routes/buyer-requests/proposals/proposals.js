const express = require("express");
const controller = require("../../../controllers/proposalController");
const authenticate = require("../../../middlewares/authenticate");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authenticate, controller.getProposals)
  .post(authenticate, controller.createProposal);

router.get("/:proposalId", controller.getProposal);

module.exports = router;
