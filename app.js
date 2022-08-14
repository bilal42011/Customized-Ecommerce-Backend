const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const chatRouter = require("./routes/chat");
const orderRouter = require("./routes/order");
const buyerRequetsRouter = require("./routes/buyer-requests/buyer-requests");
const { authenticate } = require("./controllers/authController");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// logger
app.use((req, res, next) => {
  console.log(`${req.method}\t${req.path}\t${req.query}`);
  console.log(req.body);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/chat", chatRouter);
app.use("/api/order", orderRouter);
app.use("/api/buyer-requests/", buyerRequetsRouter);

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(404).json({ status: "error", message: err.message });
  }
  next();
});

// 404 Handler
app.all("/*", (req, res, next) => {
  res.status(404).json({ error: `Path ${req.path} does not exist` });
});

module.exports = app;
