const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const user = ({
    firstName,
    lastName,
    city,
    avatar,
    address,
    email,
    phone,
    password,
  } = req.body);

  try {
    const newUser = await User.create(user);
    const tokenInfo = {
      id: newUser._id,
      isSeller: newUser.isSeller,
    };
    const token = await jwt.sign(tokenInfo, process.env.JWT_SECRET);
    return res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "error",
      info: "A required parameter is missing",
      message: err.message,
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
};

module.exports = { signUp, login };
