const authService = require("../services/AuthService");

const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        message: "The input is required",
      });
    }

    const isCheckEmail = regex.test(email);
    if (!isCheckEmail) {
      return res.status(404).json({
        message: "email is invalid",
      });
    }

    const response = await authService.register({ email, password });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

module.exports = {
  register,
};
