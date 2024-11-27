const authService = require("../services/authService");
const errorHandler = require("../utils/errorHandler");

const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const isCheckEmail = regex.test(email);
    if (!isCheckEmail) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }

    const response = await authService.register(req.body);
    return res.status(201).json(response);
  } catch (error) {
    errorHandler(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const isCheckEmail = regex.test(email);
    if (!isCheckEmail) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }

    const response = await authService.login({ email, password });

    res.cookie("refreshToken", response.refreshToken, { httpOnly: true });

    return res.status(200).json(response);
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const response = await authService.refreshToken(refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    errorHandler(res, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { newPassword } = req.body;
    const { userId } = req.query;

    if (userId !== id) {
      return errorHandler(res, {
        message: "Không đủ quyền để thực hiện yêu cầu này",
      });
    }
    const response = await authService.changePassword({ newPassword, userId });
    return res.status(200).json(response);
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  register,
  login,
  refreshToken,
  changePassword,
};
