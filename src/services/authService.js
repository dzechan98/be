const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (data, type = "AT") => {
  const secretKey =
    type === "AT"
      ? process.env.JWT_AT_SECRET_KEY
      : process.env.JWT_RT_SECRET_KEY;
  const expire = type === "AT" ? "2h" : "7d";

  return jwt.sign({ ...data }, secretKey, {
    expiresIn: expire,
  });
};

const register = ({ email, password, name }) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ email });

      if (checkUser) {
        reject("Email đã được đăng ký");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const createdUser = await User.create({
        email,
        password: hashPassword,
        name,
      });

      const payload = {
        id: createdUser._id,
        isAdmin: createdUser.isAdmin,
      };

      const accessToken = generateToken(payload);
      const refreshToken = generateToken(payload, "RT");

      resolve({ accessToken, refreshToken });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xử lý yêu cầu");
    }
  });

const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        reject("Người dùng không được xác định");
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        reject("Mật khẩu không khớp");
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

const refreshToken = (refreshToken) =>
  new Promise(async (resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_RT_SECRET_KEY, (err, decode) => {
      if (err) {
        reject("Refresh token có thể hết hạn hoặc không hợp lệ");
      }

      const accessToken = generateToken({
        id: decode.id,
        isAdmin: decode.isAdmin,
      });

      resolve({
        data: { accessToken },
      });
    });
  });

module.exports = {
  register,
  login,
  refreshToken,
};
