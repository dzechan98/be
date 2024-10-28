const userService = require("../services/userService");
const errorHandler = require("../utils/errorHandler");

const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "userId là bắt buộc" });
    }

    const result = await userService.getUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "userId là bắt buộc" });
    }

    const result = await userService.getUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await userService.getAllUsers(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addUser = async (req, res) => {
  try {
    const { name, password, image, email } = req.body;

    if (!name || !password || !image || !email) {
      return res.status(400).json({
        message: "Đầu vào không đúng định dạng",
      });
    }

    const isCheckEmail = regex.test(email);
    if (!isCheckEmail) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }

    const result = await userService.addUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "userId là bắt buộc",
      });
    }

    const result = await userService.updateUser(userId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "userId là bắt buộc" });
    }

    const result = await userService.deleteUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getUser,
  getMe,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};
