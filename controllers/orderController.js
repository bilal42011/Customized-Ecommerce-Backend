const Order = require("../models/Order");
const Product = require("../models/Product");
const Proposal = require("../models/Proposal");

class OrderController {
  async createOrder(req, res) {
    const buyerId = req.userInfo.id;
    const { productId, proposalId } = req.body;

    let seller = {};

    if (productId) {
      seller = await Product.findById(productId)
        .select("ownerId")
        .populate("ownerId");
    } else {
      seller = await Proposal.findById(proposalId)
        .select("sellerId")
        .populate("sellerId");
    }
  }

  async getOrder(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId);

      res.status(200).json({ status: "success", order });
    } catch (err) {
      res.status(404).json({
        status: "success",
        message: err.message,
      });
    }
  }

  async getOrdersAsSeller(req, res) {
    const orders = [];

    return res.status(200).json({
      status: "success",
      orders,
    });
  }

  async getOrdersAsBuyer(req, res) {
    return res.status(200).json([]);
  }

  async cancelOrder(req, res) {}
}

module.exports = { createOrder, getOrder, cancelOrder };
