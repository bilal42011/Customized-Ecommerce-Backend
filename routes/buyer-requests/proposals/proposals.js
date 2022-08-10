const express = require("express");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authenticate, controller.getProposals)
  .post(authenticate, controller.createProposal);

router.get("/:proposalId", controller.getProposals);

module.exports = router;
