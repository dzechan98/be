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

      const { password: _, isAdmin, ...data } = user.toObject();

      resolve({
        status: "OK",
        data,
      });
    } catch (error) {
      reject("An error occurred while fetching the user");
    }
  });

const getAllUsers = () =>
  new Promise(async (resolve, reject) => {
    try {
      const listUsers = await User.find();

      resolve({
        status: "OK",
        data: listUsers,
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

      const { password, ...data } = user.toObject();

      resolve({
        status: "OK",
        message: "Update user success",
        data,
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
