const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const createResponse = require("../utils/createResponse");

const getUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return reject(createResponse(400, "Người dùng không được xác định"));
      }

      resolve(user);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi tìm nạp người dùng"));
    }
  });

const getAllUsers = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const listUsers = await User.find({
        isAdmin: {
          $ne: true,
        },
      })
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await User.countDocuments();

      resolve({ results: listUsers, count });
    } catch (error) {
      reject(
        createResponse(400, "Đã xảy ra lỗi khi tìm nạp danh sách người dùng")
      );
    }
  });

const addUser = (body) =>
  new Promise(async (resolve, reject) => {
    const { email, password, ...rest } = body;
    try {
      const checkUser = await User.findOne({ email });

      if (checkUser) {
        return reject(createResponse(400, "Email đã được đăng ký"));
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const createdUser = await User.create({
        email,
        password: hashPassword,
        ...rest,
      });

      resolve(createdUser);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi xử lý yêu cầu"));
    }
  });

const updateUser = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndUpdate(userId, body, {
        new: true,
      });

      if (!user) {
        return reject(createResponse(400, "Người dùng không được xác định"));
      }

      resolve(user);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi cập nhật người dùng"));
    }
  });

const deleteUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return reject(createResponse(400, "Người dùng không được xác định"));
      }

      resolve({ message: "Delete user success" });
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi xóa người dùng"));
    }
  });

module.exports = {
  getUser,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};
