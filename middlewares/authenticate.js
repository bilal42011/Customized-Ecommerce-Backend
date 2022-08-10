const jwt = require("jsonwebtoken");

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

module.exports = authenticate;
