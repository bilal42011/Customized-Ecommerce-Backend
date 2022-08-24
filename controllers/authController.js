const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailer");

const generateOTP = () => `${Math.floor(1000 + Math.random() * 9000)}`;

class AuthController {
  async signUp(req, res) {
    const { firstName, lastName, city, address, email, phone, password } =
      req.body;

    const user = { firstName, lastName, city, address, email, phone, password };
    user.avatar = req.file?.path;

    try {
      const newUser = await User.create(user);
      const tokenInfo = { id: newUser._id, isSeller: newUser.isSeller };
      const token = await jwt.sign(tokenInfo, process.env.JWT_SECRET);

      const OTP = generateOTP();

      newUser.authCode = OTP;
      await newUser.save();

      const mailRespone = await sendEmail({
        to: newUser.email,
        subject: "E-Workers Account verification",
        html: `Your Authentication code is <h1>${OTP}</h1>`, //otp
      });

      return res.status(201).json({
        status: "success",
        token,
        user: newUser,
      });
    } catch (err) {
      res.status(404).json({
        status: "error",
        info: "A required parameter is missing",
        message: err.message,
      });
    }
  }

  async verifyAccount(req, res) {
    const { authCode } = req.body;

    try {
      const user = await User.findById(req.userInfo.id);

      if (user.authCode == authCode) {
        user.isVerified = true;
        await user.save();
      } else {
        throw new Error("Incorrect authentication code");
      }
      return res.status(200).json({
        status: "success",
        user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });
      if (!(await user.comparePassword(password))) {
        throw new Error("Incorrect password!");
      }

      const tokenInfo = {
        id: user._id,
        isSeller: user.isSeller,
      };
      const userDoc = user.toObject();

      if (!user.isVerified) {
        user.authCode = generateOTP();
        await user.save();
      }

      delete userDoc.password;
      const token = await jwt.sign(tokenInfo, process.env.JWT_SECRET);
      return res.status(201).json({
        status: "success",
        token,
        user: userDoc,
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        status: "error",
        message: err.message,
      });
    }
  }
}

module.exports = new AuthController();
