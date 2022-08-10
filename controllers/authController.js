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
    const tokenInfo = { id: newUser._id, isSeller: newUser.isSeller };
    const token = await jwt.sign(tokenInfo, process.env.JWT_SECRET);
    return res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      info: "A required parameter is missing",
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!(await user.comparePassword(password))) {
      throw new Error("Incorrect password!");
    }
    const tokenInfo = {
      id: user._id,
      isSeller: user.isSeller,
    };
    const token = await jwt.sign(tokenInfo, process.env.JWT_SECRET);
    return res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

//authenticate middleware
const authenticate = (req, res, next) => {
  if (!req.headers["authorization"]) throw new Error("Unauthorized");
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) throw new Error("Token verification failed");
    req.userInfo = payload;
    next();
  });
};

module.exports = { signUp, login, authenticate };
