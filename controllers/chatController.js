const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const USER_FIELDS = ["avatar", "_id", "city", "firstName", "lastName"];

class ChatController {
  async getUserChat(req, res) {
    try {
      const { userId } = req.params;
      const selfId = req.userInfo.id;
      let chatDTO = {};
      let chat = await Chat.findOne({
        $or: [
          { $and: [{ user1: userId }, { user2: selfId }] },
          { $and: [{ user1: selfId }, { user2: userId }] },
        ],
      }).populate([
        {
          path: "user1",
          populate: USER_FIELDS,
        },
        {
          path: "user2",
          populate: USER_FIELDS,
        },
      ]);

      if (!chat) {
        chat = await Chat.create({
          user1: selfId,
          user2: userId,
        });
        await User.findByIdAndUpdate(userId, {
          $push: { chats: chat._id },
        });
        await User.findByIdAndUpdate(selfId, {
          $push: { chats: chat._id },
        });
        chat = await chat.populate([
          {
            path: "user1",
            populate: USER_FIELDS,
          },
          {
            path: "user2",
            populate: USER_FIELDS,
          },
        ]);
      }
      const messages = await Message.find({ chatId: chat._id })
        .sort({ createdAt: "desc" })
        .limit(30);

      chatDTO = {
        _id: chat._id,
        to: userId === chat.user1.id ? chat.user1 : chat.user2,
        lastMessage: messages[0],
        messages,
      };
      return res.status(200).json({
        status: "success",
        chat: chatDTO,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async createChat(req, res) {}

  async getMessages(req, res) {
    try {
      const { chatId } = req.params;

      const messages = await Message.find({ chatId });

      return res.status(200).json({ messages });
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async addMessage(req, res) {
    try {
      const { chatId } = req.params;
      const selfId = req.userInfo.id;
      const { message } = req.body;
      let chatDTO = {};

      message.sender = req.userInfo.id;
      const newMessage = await Message.create(message);

      const chat = await Chat.findByIdAndUpdate(chatId, {
        $push: { messages: newMessage._id },
      }).populate([
        {
          path: "user1",
          populate: USER_FIELDS,
        },
        {
          path: "user2",
          populate: USER_FIELDS,
        },
      ]);
      newMessage.chatId = chat._id;
      await newMessage.save();

      if (!chat) {
        throw new Error("Chat doesn't exist");
      }

      return res.status(200).json({
        status: "success",
        chat,
        message: newMessage,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

module.exports = new ChatController();
