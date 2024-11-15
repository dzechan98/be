const overviewService = require("../services/overviewService");
const errorHandler = require("../utils/errorHandler");

const getDashboardStats = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await overviewService.getDashboardStats(page, limit);

    res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getDashboardStats,
};
