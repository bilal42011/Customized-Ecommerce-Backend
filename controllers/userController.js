const Product = require("../models/Product");
const User = require("../models/User");

class UserController {
  async getInfo(req, res) {
    const user = await User.findById(req.userInfo.id);
    return res.status(200).json({
      status: "success",
      user,
    });
  }

  async patchUser(req, res) {
    const user = await User.findByIdAndUpdate(req.userInfo.id, req.body);
    return res.status(204).json({
      status: "success",
      user,
    });
  }

  async upgradeAccount(req, res) {
    const buyerId = req.userInfo.id;
    try {
      const { category } = req.body;

      const user = await User.findByIdAndUpdate(buyerId, {
        category: category,
        isSeller: true,
      });

      await user.save();
      console.log(user);

      return res.status(201).json({
        status: "success",
        user,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async getBuyerRequets(req, res) {
    try {
      const buyerRequests = await User.findById(req.userInfo.id)
        .select("buyerRequests")
        .populate("buyerRequests");

      return res.status(200).json({
        status: "success",
        buyerRequests: buyerRequests.buyerRequests,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: "error",
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

  async getChats(req, res) {
    const buyerRequests = await User.findById(req.userInfo.id)
      .select("chats")
      .populate("chats");

    return res.status(200).json({
      status: "success",
      buyerRequests,
    });
  }

  // Public routes
  async getUserInfo(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).select(
        "-password -orders -email -phone"
      );
      return res.status(200).json({
        status: "success",
        user,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async getProducts(req, res) {
    const { userId } = req.params;

    const products = await User.findById(userId)
      .select("products")
      .populate("products");

    res.status(200).json({
      status: "success",
      products,
    });
  }
}

module.exports = new UserController();

// // Authenticated Routes
// const getSelfInfo = (req, res) => {
//   return res.json({ user: req.userInfo });
// };

// const patchUser = (req, res) => {
//   return res.json({ user: req.userInfo });
// };

// const getBuyerRequets = (req, res) => {};

// const getOrders = (req, res) => {};

// const getChats = (req, res) => {};

// // Unauthenticated Routes
// const getUserInfo = (req, res) => {
//   const { userId } = req.params;
//   return res.json({ user: userId });
// };

// const getProducts = (req, res) => {};

// module.exports = {
//   getSelfInfo,
//   patchUser,
//   getUserInfo,
//   getProducts,
//   getBuyerRequets,
//   getOrders,
//   getChats,
// };
