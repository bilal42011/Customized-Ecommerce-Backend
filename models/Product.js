const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
  images: [
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
  hasSizes: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Price must be greater than 0"],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be a valid number"],
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
