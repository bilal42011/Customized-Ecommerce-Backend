const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyerRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BuyerRequest",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
  },
  orderStatus: {
    type: String,
    enum: ["IN_PROGRESS", "DELIVERED", "CANCELLED", "COMPLETED"],
    default: "IN_PROGRESS",
  },
  budget: {
    type: Number,
    min: [1, "Budget must be greater than 0"],
  },
  deliveryTime: {
    type: Number,
    min: [1, "Invalid timeline"],
  },
  message: String,
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
  dueIn: {
    type: Date,
    default: function () {
      const date = new Date();
      date.setHours(24 * this.deliveryTime);
      return date;
    },
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
