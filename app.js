const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const { authenticate } = require("./controllers/authController");
const app = express();

app.use(cors());
app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`${req.path}\t${req.query}`);
  console.log(req.body);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(404).json({ status: "error", message: err.message });
  }
  next();
});

// 404 Handler
app.all("/*", (req, res, next) => {
  res.status(404).json({ error: `Path ${req.path} does not exist` });
});

module.exports = app;
