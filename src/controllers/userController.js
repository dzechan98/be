const userService = require("../services/userService");

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const result = await userService.getUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching the user",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching the users",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const result = await userService.updateUser(userId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while updating the user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const result = await userService.deleteUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting the user",
    });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
