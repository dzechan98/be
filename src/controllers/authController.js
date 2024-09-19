const authService = require("../services/authService");

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
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (error === "Email đã được đăng ký") {
      statusCode = 409;
      message = error;
    }

    return res.status(statusCode).json({ message });
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
    console.log(error);
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error === "Người dùng không được xác định" ||
      error === "Mật khẩu không khớp"
    ) {
      statusCode = 400;
      message = "Email hoặc mật khẩu không chính xác";
    }

    return res.status(statusCode).json({
      message: message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const response = await authService.refreshToken(refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    if (error === "Refresh token có thể hết hạn hoặc không hợp lệ") {
      return res.status(401).json({
        message: error,
      });
    }
    return res.status(500).json({
      message: "Lỗi máy chủ",
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};
