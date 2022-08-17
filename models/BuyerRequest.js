const mongoose = require("mongoose");

const buyerRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
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
    enum: ["Open", "Order in progress", "Closed"],
    default: "Open",
  },
  budget: {
    type: Number,
    min: [1, "Price must be greater than 0"],
  },
  deliveryTime: {
    type: Number,
    min: [1, "Invalid timeline"],
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  proposals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
    },
  ],
});

const BuyerRequest = mongoose.model("BuyerRequest", buyerRequestSchema);
module.exports = BuyerRequest;
