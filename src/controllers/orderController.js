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

const getAllOrder = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await orderService.getAllOrder(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const result = await orderService.cancelOrder(req.body.orderId);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateStatusOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderService.updateStatusOrder(
      orderId,
      req.body.status
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  cancelOrder,
  getAllOrder,
  updateStatusOrder,
};
