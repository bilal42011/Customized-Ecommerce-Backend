const Message = require("../models/Message");
const Product = require("../models/Product");
const User = require("../models/User");

const USER_FIELDS = ["avatar", "_id", "city", "firstName", "lastName"];

class UserController {
  async getInfo(req, res) {
    const user = await User.findById(req.userInfo.id).populate("products");
    return res.status(200).json({
      status: "success",
      user,
    });
  }

  async patchUser(req, res) {
    const { firstName, lastName, description, city, address, email, phone } =
      req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.userInfo.id,
        { firstName, lastName, description, city, address, email, phone },
        {
          new: true,
        }
      );
      return res.status(200).json({
        status: "success",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
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

  async getChats(req, res) {
    try {
      const user = await User.findById(req.userInfo.id)
        .select("chats")
        .sort({ createdAt: "desc" })
        .populate({
          path: "chats",
          populate: [
            { path: "user1", select: USER_FIELDS },
            { path: "user2", select: USER_FIELDS },
          ],
        });

      const chats = await Promise.all(
        user.chats.map(async (chat) => {
          let item = {};

          console.log(chat);

          const messages = await Message.find({ chatId: chat._id })
            .sort({ createdAt: "desc" })
            .limit(1);

          console.log("Chat User1", chat.user1.id);
          console.log("Chat User2", chat.user2.id);
          console.log("userid", user.id);

          item = {
            _id: chat._id,
            lastMessage: messages[0],
          };
          if (chat.user1.id == user.id) {
            // if logged in user is user1
            item.to = chat.user2;
          } else if (chat.user2.id == user.id) {
            item.to = chat.user1;
          }

          console.log("Item", item);

          return item;
        })
      );

      console.log("Chats", chats);
      return res.status(200).json({
        status: "success",
        user: {
          ...user._doc,
          chats,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        status: "error",
        message: err.message,
      });
    }
  }

  // Public routes
  async getUserInfo(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId)
        .select("-password -orders -email -phone")
        .populate("products");
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

  async getPopularSellers(req, res) {
    try {
      const users = await User.find({ isSeller: true })
        .sort({ orderCount: "desc" })
        .limit(6);
      return res.status(200).json({
        status: "success",
        sellers: users,
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
