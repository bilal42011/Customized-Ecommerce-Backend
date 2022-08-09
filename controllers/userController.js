const getSelfInfo = (req, res) => {
  return res.json({ user: req.userInfo });
};

const patchUser = (req, res) => {
  return res.json({ user: req.userInfo });
};

const getUserInfo = (req, res) => {
  const { userId } = req.params;
  return res.json({ user: userId });
};

module.exports = { getSelfInfo, patchUser, getUserInfo };
