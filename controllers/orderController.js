const BuyerRequest = require("../models/BuyerRequest");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Proposal = require("../models/Proposal");
const User = require("../models/User");

const PUBLIC_USER_FIELDS = [
  "fullName",
  "email",
  "_id",
  "city",
  "firstName",
  "phone",
  "description",
  "lastName",
  "address",
  "avatar",
];

const ORDER_FIELDS_TO_POPULATE = [
  {
    path: "sellerId",
    select: PUBLIC_USER_FIELDS,
  },
  {
    path: "buyerId",
    select: PUBLIC_USER_FIELDS,
  },
  "buyerRequestId",
  "proposalId",
  "productId",
];

class OrderController {
  async createOrder(req, res) {
    try {
      const buyerId = req.userInfo.id;
      const { products, shippingInfo, paymentInfo } = req.body;

      const ids = products.map((elem) => elem._id);

      const cartProducts = await Product.find({ _id: { $in: ids } });
      let total = 0;

      const orders = await Promise.all(
        cartProducts.map(async (product, i) => {
          const item = products.find((e) => e._id == product._id);
          if (item.quantity > product.quantity) {
            throw new Error(
              `Not enough stock available for '${product.title}'`
            );
          } else {
            total += product.price * item.quantity;
          }
          const order = {
            sellerId: product.ownerId,
            buyerId: req.userInfo.id,
            productId: product._id,
            productQuantity: item.quantity,
            deliveryTime: 3,
            budget: product.price,
            shippingInfo,
            paymentInfo,
          };

          const seller = await User.findByIdAndUpdate(product.ownerId, {
            $inc: { orderCount: 1 },
          });

          const newOrder = await Order.create(order);
          product.quantity -= item.quantity;
          await product.save();
          return newOrder;
        })
      );

      res.status(200).json({
        status: "success",
        orders,
      });

      // Not implemented
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async getOrder(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate(
        ORDER_FIELDS_TO_POPULATE
      );

      res.status(200).json({ status: "success", order });
    } catch (err) {
      res.status(404).json({
        status: "success",
        message: err.message,
      });
      console.log(err);
    }
  }

  async getOrdersAsSeller(req, res) {
    try {
      const userId = req.userInfo.id;
      const orders = await Order.find({ sellerId: userId }).populate("buyerId");

      return res.status(200).json({
        status: "success",
        orders,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async getOrdersAsBuyer(req, res) {
    try {
      const userId = req.userInfo.id;
      const orders = await Order.find({ buyerId: userId }).populate(
        "sellerId",
        PUBLIC_USER_FIELDS
      );

      return res.status(200).json({
        status: "success",
        orders,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async deliverOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { message } = req.body;
      const files = req.files.map((e) => {
        return { path: e.path, filename: e.filename };
      });
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          message: message,
          orderStatus: "DELIVERED",
          attachments: files,
        },
        { new: true }
      );
      await order.populate(ORDER_FIELDS_TO_POPULATE);

      return res.status(200).json({
        status: "success",
        order,
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async cancelConfirm(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: "CANCELLED",
        },
        { new: true }
      );
      await order.populate(ORDER_FIELDS_TO_POPULATE);
      return res.status(200).json({
        status: "success",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          message: req.body.message,
          orderStatus: "PENDING_CANCEL",
          cancelInitiator: req.userInfo.id,
        },
        { new: true }
      );
      await order.populate(ORDER_FIELDS_TO_POPULATE);
      return res.status(200).json({
        status: "success",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async approveOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: "COMPLETED",
        },
        { new: true }
      );
      const buyerRequest = await BuyerRequest.findByIdAndUpdate(
        order.buyerRequestId,
        {
          status: "CLOSED",
        }
      );
      await order.populate(ORDER_FIELDS_TO_POPULATE);
      return res.status(200).json({
        status: "success",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
  async undoCancel(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          message: "",
          orderStatus: "IN_PROGRESS",
          cancelInitiator: null,
        },
        { new: true }
      );
      await order.populate(ORDER_FIELDS_TO_POPULATE);
      return res.status(200).json({
        status: "success",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
  async declineOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: "IN_PROGRESS",
        },
        { new: true }
      );
      await order.populate(ORDER_FIELDS_TO_POPULATE);
      return res.status(200).json({
        status: "success",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
}

module.exports = new OrderController();
