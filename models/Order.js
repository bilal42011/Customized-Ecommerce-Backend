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
  orderStatus: {
    type: String,
    enum: ["In Progress", "Delivered", "Cancelled", "Completed"],
    default: "In Progress",
  },
  budget: {
    type: Number,
    min: [1, "Budget must be greater than 0"],
  },
  deliveryTime: {
    type: Number,
    min: [1, "Invalid timeline"],
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
