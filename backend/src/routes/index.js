const express = require("express");
const {
  createChallengeController,
  issueCardController,
  signInController,
} = require("../controllers/authController");
const { getDashboardController } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/health", (_req, res) => res.json({ ok: true }));
router.post("/auth/login", (req, res) => {
  const username = req.body?.username || "guest";
  res.json({ token: `mock-token-${username}`, user: { username } });
});
router.post("/auth/challenge", createChallengeController);
router.post("/auth/issue-card", issueCardController);
router.post("/auth/sign-in", signInController);
router.post("/wallet/approve", (req, res) => {
  const { address, network, status, mode, accountId } = req.body || {};
  if (!address || !network) {
    return res.status(400).json({ error: "Wallet address and network are required." });
  }
  res.json({
    ok: true,
    recorded: {
      accountId: accountId || null,
      address,
      network,
      status: status || "pending",
      mode: mode || "stub",
      approvedAt: new Date().toISOString(),
    },
  });
});
router.get("/dashboard", getDashboardController);

module.exports = router;
