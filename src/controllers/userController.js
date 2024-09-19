const userService = require("../services/userService");

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "userId là bắt buộc" });
    }

    const result = await userService.getUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    let message = "Lỗi máy chủ";
    let statusCode = 500;
    if (error == "Đã xảy ra lỗi khi tìm nạp người dùng") {
      statusCode = 400;
      message = error;
    }
    return res.status(statusCode).json({ message });
  }
};

const getMe = async (req, res) => {
  console.log(req.user);
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "userId là bắt buộc" });
    }

    const result = await userService.getUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    let message = "Lỗi máy chủ";
    let statusCode = 500;
    if (error == "Đã xảy ra lỗi khi tìm nạp người dùng") {
      statusCode = 400;
      message = error;
    }
    return res.status(statusCode).json(message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await userService.getAllUsers(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi tìm nạp danh sách người dùng",
    });
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
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật người dùng",
    });
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
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa người dùng",
    });
  }
};

module.exports = {
  getUser,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
};
