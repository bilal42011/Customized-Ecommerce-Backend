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
      buyerRequest.attachments = req.files?.map((e) => {
        return { filename: e.filename, path: e.path };
      });

      const newBuyerRequest = await BuyerRequest.create(buyerRequest);

      await User.findByIdAndUpdate(buyerId, {
        $push: { buyerRequests: newBuyerRequest._id },
      });

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
      const request = await BuyerRequest.findById(requestId).populate(
        "buyerId"
      );
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
      const { page } = req.query,
        limit = 10;
      const user = await User.findById(userId);

      // find the buyer requests where category = user's selling category
      // and that request is not posted by this user
      const buyerRequests = await BuyerRequest.find({
        $and: [{ category: user.category }, { buyerId: { $ne: user._id } }],
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("buyerId");

      return res.status(200).json({
        status: "success",
        buyerRequests,
        totalPages: Math.ceil(buyerRequests.length / limit),
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
