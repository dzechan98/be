const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      reject("Đã xảy ra lỗi khi tìm nạp danh sách người dùng");
    }
  });

const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return reject("Người dùng không được xác định");
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return reject("Mật khẩu không khớp");
      }

      const payload = {
        id: user._id,
        isAdmin: user.isAdmin,
      };

      const accessToken = generateToken(payload);
      const refreshToken = generateToken(payload, "RT");

      resolve({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xử lý yêu cầu");
    }
  });

const addUser = (body) =>
  new Promise(async (resolve, reject) => {
    const { email, password, ...rest } = body;
    try {
      const checkUser = await User.findOne({ email });

      if (checkUser) {
        return reject("Email đã được đăng ký");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const createdUser = await User.create({
        email,
        password: hashPassword,
        ...rest,
      });

      resolve({ ...createdUser.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xử lý yêu cầu");
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
  addUser,
  updateUser,
  deleteUser,
};
