const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`${req.path}\t${req.query}`);
  console.log(req.body);
  next();
});

app.get("/", (req, res) => res.json({ message: "Hello Wrold" }));

// 404 Handler
app.all("/*", (req, res, next) => {
  res.status(404).json({ error: `Path ${req.path} does not exist` });
});

module.exports = app;
