const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const generateToken = (data, type = "AT") => {
  return jwt.sign({ ...data }, process.env.JWT_SECRET_KEY, {
    expiresIn: type === "AT" ? "1d" : "5d",
  });
};

const register = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        email,
      });

      if (checkUser) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const accessToken = generateToken(email);
      const refreshToken = generateToken(email, "RT");
      const createdUser = await User.create({
        email,
        password: hashPassword,
        accessToken,
        refreshToken,
      });

      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
      resolve(body);
    } catch (error) {
      reject(error);
    }
  });

const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        email,
      });

      if (checkUser) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const accessToken = generateToken(email);
      const refreshToken = generateToken(email, "RT");
      const createdUser = await User.create({
        email,
        password: hashPassword,
        accessToken,
        refreshToken,
      });

      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
      resolve(body);
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  register,
  login,
};
