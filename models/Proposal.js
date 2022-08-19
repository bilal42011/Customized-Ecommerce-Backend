const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  coverLetter: {
    type: String,
    required: true,
  },
  attachments: [
    {
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "DECLINED", "ACCEPTED"],
    default: "PENDING",
  },
  budget: {
    type: Number,
    min: [1, "Budget must be greater than 0"],
  },
  deliveryTime: {
    type: Number,
    min: [1, "Invalid timeline"],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyerRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BuyerRequest",
  },
});

const Proposal = mongoose.model("Proposal", proposalSchema);
module.exports = Proposal;
