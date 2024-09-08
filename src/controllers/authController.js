const authService = require("../services/authService");

const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const isCheckEmail = regex.test(email);
    if (!isCheckEmail) {
      return res.status(400).json({
        message: "Email is invalid",
      });
    }

    const response = await authService.register({ email, password });
    return res.status(201).json(response);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (error === "The email is already registered") {
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
        message: "Email and password are required",
      });
    }

    const isCheckEmail = regex.test(email);
    if (!isCheckEmail) {
      return res.status(400).json({
        message: "Email is invalid",
      });
    }

    const response = await authService.login({ email, password });
    const { refreshToken, password: _, ...data } = response;

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    let statusCode = 500;
    let message = "Internal server error";

    if (
      error === "The user is not defined" ||
      error === "Password does not match"
    ) {
      statusCode = 401;
      message = "Invalid email or password";
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
    if (error === "Refresh token may be expired or invalid") {
      return res.status(401).json({
        message: error,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};
