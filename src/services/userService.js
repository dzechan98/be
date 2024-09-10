const User = require("../models/userModel");

const getUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        resolve({ message: "Người dùng không được xác định" });
      }

      resolve({ ...user.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi tìm nạp người dùng");
    }
  });

const getAllUsers = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const listUsers = await User.find()
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await User.countDocuments();

      resolve({ results: listUsers, count });
    } catch (error) {
      reject("Đã xảy ra lỗi khi tìm nạp danh sách người dùng");
    }
  });

const updateUser = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndUpdate(userId, body, {
        new: true,
      });

      if (!user) {
        return resolve({ message: "Người dùng không được xác định" });
      }

      resolve({ ...user.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi cập nhật người dùng");
    }
  });

const deleteUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return resolve({ message: "Người dùng không được xác định" });
      }

      resolve({ message: "Delete user success" });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xóa người dùng");
    }
  });

module.exports = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
