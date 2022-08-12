const Product = require("../models/Product");
const Proposal = require("../models/Proposal");

class OrderController {
  async createOrder(req, res) {
    const buyerId = req.userInfo.id;
    const { proposalId } = req.body;

    let seller = {};

    if (isReadyMade) {
      seller = await Product.findById(productId)
        .select("ownerId")
        .populate("ownerId");
    } else {
      seller = await Proposal.findById(proposalId)
        .select("sellerId")
        .populate("sellerId");
    }
  }
}

const createOrder = (req, res) => {};

const getOrder = (req, res) => {};

const cancelOrder = (req, res) => {};

module.exports = { createOrder, getOrder, cancelOrder };
