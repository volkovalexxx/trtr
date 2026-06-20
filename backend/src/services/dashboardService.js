const { all } = require("../db/init");

async function getDashboard() {
  const transactions = await all("SELECT id, title, type, amount, created_at FROM transactions ORDER BY datetime(created_at) DESC LIMIT 5");
  return {
    profile: { brand: "TRON x TRUST", walletLabel: "Main Wallet" },
    balance: { totalUsd: 4820.45, totalTrx: 13442.1, dailyChangePct: 2.8, pnlUsd: 128.77 },
    assets: [
      { symbol: "USDT", network: "TRC20", valueUsd: 2200.0 },
      { symbol: "TRX", network: "Native", valueUsd: 1940.12 },
      { symbol: "USDC", network: "Bridged", valueUsd: 680.33 }
    ],
    transactions
  };
}

module.exports = { getDashboard };
