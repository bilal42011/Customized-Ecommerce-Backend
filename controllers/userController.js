// Authenticated Routes
const getSelfInfo = (req, res) => {
  return res.json({ user: req.userInfo });
};

const patchUser = (req, res) => {
  return res.json({ user: req.userInfo });
};

const getBuyerRequets = (req, res) => {};

const getOrders = (req, res) => {};

const getChats = (req, res) => {};

// Unauthenticated Routes
const getUserInfo = (req, res) => {
  const { userId } = req.params;
  return res.json({ user: userId });
};

const getProducts = (req, res) => {};

module.exports = {
  getSelfInfo,
  patchUser,
  getUserInfo,
  getProducts,
  getBuyerRequets,
  getOrders,
  getChats,
};
