const cartService = require("../services/cartService");
const errorHandler = require("../utils/errorHandler");

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartByUserId(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addItem = async (req, res) => {
  try {
    const product = req.body;
    const cart = await cartService.addItemToCart(req.user.id, product);
    res.status(200).json(cart);
  } catch (error) {
    errorHandler(res, error);
  }
};

const decrementItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const updatedCart = await cartService.decrementItemInCart(
      userId,
      productId
    );
    return res.status(200).json(updatedCart);
  } catch (error) {
    errorHandler(res, error);
  }
};

const incrementItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const updatedCart = await cartService.incrementItemInCart(
      userId,
      productId
    );
    return res.status(200).json(updatedCart);
  } catch (error) {
    errorHandler(res, error);
  }
};

const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeItemFromCart(req.user.id, productId);
    res.status(200).json(cart);
  } catch (error) {
    errorHandler(res, error);
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getCart,
  addItem,
  decrementItem,
  incrementItem,
  removeItem,
  clearCart,
};
