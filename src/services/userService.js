const User = require("../models/userModel");

const getUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        data: user,
      });
    } catch (error) {
      reject("An error occurred while fetching the user");
    }
  });

const getAllUsers = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const listUsers = await User.find()
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await User.countDocuments();
      const totalPage = Math.ceil(count / limit);

      resolve({
        status: "OK",
        results: {
          data: listUsers,
          totalPage,
        },
      });
    } catch (error) {
      reject("An error occurred while fetching the users");
    }
  });

const updateUser = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndUpdate(userId, body, {
        new: true,
      });

      if (!user) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Update user success",
        data: user,
      });
    } catch (error) {
      reject("An error occurred while updating the user");
    }
  });

const deleteUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (error) {
      reject("An error occurred while deleting the user");
    }
  });

module.exports = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
