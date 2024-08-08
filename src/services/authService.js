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

const register = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ email });

      if (checkUser) {
        reject("The email is already registered");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const createdUser = await User.create({
        email,
        password: hashPassword,
      });

      const { password: _, ...data } = createdUser.toObject();

      resolve({
        status: "OK",
        message: "SUCCESS",
        data,
      });
    } catch (error) {
      reject("An error occurred while processing the request");
    }
  });

const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        reject("The user is not defined");
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        reject("Password does not match");
      }

      const payload = {
        id: user.id,
        isAdmin: user.isAdmin,
      };

      user.accessToken = generateToken(payload);
      user.refreshToken = generateToken(payload, "RT");

      await user.save();
      const { password: _, ...data } = user.toObject();

      resolve({
        status: "OK",
        message: "SUCCESS",
        data,
      });
    } catch (error) {
      reject("An error occurred while processing the request");
    }
  });

const refreshToken = (token) =>
  new Promise(async (resolve, reject) => {
    jwt.verify(token, process.env.JWT_RT_SECRET_KEY, (err, decode) => {
      if (err) {
        reject("Refresh token may be expired or invalid");
      }

      const accessToken = generateToken({
        id: decode.id,
        isAdmin: decode.isAdmin,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: {
          accessToken,
        },
      });
    });
  });

module.exports = {
  register,
  login,
  refreshToken,
};
