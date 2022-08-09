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
      type: String,
      required: true,
    },
  ],
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
});

const BuyerRequest = mongoose.model("BuyerRequest", buyerRequestSchema);
module.exports = BuyerRequest;
