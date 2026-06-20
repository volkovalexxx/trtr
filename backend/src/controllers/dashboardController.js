const { getDashboard } = require("../services/dashboardService");

async function getDashboardController(_req, res) {
  const data = await getDashboard();
  res.json(data);
}

module.exports = { getDashboardController };
