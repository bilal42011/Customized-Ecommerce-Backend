const BuyerRequest = require("../models/BuyerRequest");
const User = require("../models/User");

class BuyerRequestsController {
  async createBuyerRequest(req, res) {
    const buyerId = req.userInfo.id;
    try {
      const { title, description, category, budget, deliveryTime } = req.body;
      const buyerRequest = {
        title,
        description,
        category,
        budget,
        deliveryTime,
      };
      buyerRequest.buyerId = buyerId;
      buyerRequest.attachments = req.files?.map((e) => e.path);

      const newBuyerRequest = await BuyerRequest.create(buyerRequest);
      return res.status(201).json({
        status: "success",
        buyerRequest: newBuyerRequest,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: "error",
        info: "Bad Request",
        message: err.message,
      });
    }
  }
  async getBuyerRequest(req, res) {
    const { requestId } = req.params;

    try {
      const request = await BuyerRequest.findById(requestId);
      return res.status(200).json({
        status: "success",
        request,
      });
    } catch (err) {
      console.log(err);
      return res.json(404).json({
        status: "error",
        info: "ID not found",
        message: err.message,
      });
    }
  }
  async getBuyerRequestsByCategory(req, res) {
    try {
      const userId = req.userInfo.id;
      const category = await User.findById(userId).select("category");

      const buyerRequets = await BuyerRequest.find({ category: category });

      return res.status(200).json({
        status: "success",
        buyerRequets,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
}

module.exports = new BuyerRequestsController();
