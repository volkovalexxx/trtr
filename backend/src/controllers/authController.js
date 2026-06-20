const {
  createWalletChallenge,
  issueCardAccount,
  signInWithWallet,
} = require("../services/authService");

function sendError(res, error) {
  res.status(error.status || 500).json({
    error: error.message || "Unexpected backend error.",
  });
}

async function createChallengeController(req, res) {
  try {
    const challenge = await createWalletChallenge(req.body || {});
    res.json(challenge);
  } catch (error) {
    sendError(res, error);
  }
}

async function issueCardController(req, res) {
  try {
    const result = await issueCardAccount(req.body || {});
    res.status(result.existing ? 200 : 201).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

async function signInController(req, res) {
  try {
    const result = await signInWithWallet(req.body || {});
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  createChallengeController,
  issueCardController,
  signInController,
};
