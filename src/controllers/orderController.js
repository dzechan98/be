const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = { ...req.body, user: userId };
    const result = await orderService.createOrder(orderData);

    if (result.message) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const result = await orderService.getOrdersByUser(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = { createOrder, getOrdersByUser };
