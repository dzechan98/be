const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const createResponse = require("../utils/createResponse");

const getDashboardStats = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const [totalOrders, totalUsers, orders, topProducts, count] =
        await Promise.all([
          Order.countDocuments({ status: "delivered" }),
          User.countDocuments({
            _id: { $in: await Order.distinct("user", { status: "delivered" }) },
          }),
          Order.find({ status: "delivered" }),
          Product.find({ sold: { $gt: 0 } })
            .sort({ sold: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .select("title sold price"),
          Product.countDocuments({ sold: { $gt: 0 } }),
        ]);

      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      resolve({
        totalOrders,
        totalUsers,
        totalRevenue,
        topProducts: { results: topProducts, count },
      });
    } catch (error) {
      reject(createResponse(400, "Lỗi khi lấy thống kê dashboard"));
    }
  });

module.exports = {
  getDashboardStats,
};
