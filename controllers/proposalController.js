const BuyerRequest = require("../models/BuyerRequest");
const Proposal = require("../models/Proposal");
const User = require("../models/User");

class ProposalController {
  async getProposals(req, res) {
    try {
      const { requestId } = req.params;
      const request = await BuyerRequest.findById(requestId).populate(
        "proposals"
      );
      res.status(200).json({
        status: "success",
        request,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async createProposal(req, res) {
    try {
      const { requestId } = req.params;
      const proposal = req.body;
      proposal.attachments = req.files.map((elem) => {
        return { filename: elem.filename, path: elem.path };
      });
      proposal.buyerRequestId = requestId;
      proposal.sellerId = req.userInfo.id;

      const newProposal = await Proposal.create(proposal);
      const user = await User.findByIdAndUpdate(req.userInfo.id, {
        $addToSet: { sellerProposals: newProposal._id },
      });
      const request = await BuyerRequest.findByIdAndUpdate(requestId, {
        $push: { proposals: newProposal._id },
      });

      res.status(201).json({
        status: "success",
        proposal: newProposal,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async getProposal(req, res) {
    try {
      const { proposalId } = req.params;
      const proposal = await Proposal.findById(proposalId);
      res.status(200).json({
        status: "success",
        proposal,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
}

module.exports = new ProposalController();
