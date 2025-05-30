const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const createResponse = require("../utils/createResponse");

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

const register = (body) =>
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

      const payload = {
        id: createdUser._id,
        isAdmin: createdUser.isAdmin,
      };

      const accessToken = generateToken(payload);
      const refreshToken = generateToken(payload, "RT");

      resolve({ accessToken, refreshToken });
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi đăng ký tài khoản"));
    }
  });

const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return reject(createResponse(400, "Người dùng không được xác định"));
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return reject(createResponse(400, "Mật khẩu không khớp"));
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
      reject(createResponse(400, "Đã xảy ra lỗi khi đăng nhập"));
    }
  });

const refreshToken = (refreshToken) =>
  new Promise(async (resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_RT_SECRET_KEY, (err, decode) => {
      if (err) {
        return reject(
          createResponse(400, "Refresh token có thể hết hạn hoặc không hợp lệ")
        );
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

const changePassword = ({ newPassword, userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return reject(createResponse(400, "Người dùng không được xác định"));
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashPassword;

      console.log({ user, newPassword });
      await user.save();

      resolve({
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      reject(createResponse(400, "Đã có lỗi xảy ra khi đổi mật khẩu"));
    }
  });

module.exports = {
  register,
  login,
  refreshToken,
  changePassword,
};
