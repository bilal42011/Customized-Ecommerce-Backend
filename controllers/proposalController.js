const getProposals = (req, res) => {};

const createProposal = (req, res) => {
  console.log(req.params);
  res.status(200).json();
};

const getProposal = (req, res) => {};

module.exports = { getProposal, getProposals, createProposal };
