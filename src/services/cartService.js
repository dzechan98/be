const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const createResponse = require("../utils/createResponse");

const getCartByUserId = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = await Cart.create({ userId, items: [] });
      }
      resolve(cart);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi tìm nạp giỏ hàng"));
    }
  });

const addItemToCart = (userId, product) =>
  new Promise(async (resolve, reject) => {
    try {
      const dbProduct = await Product.findById(product.productId);
      if (!dbProduct) {
        return reject(createResponse(400, "Không tìm thấy sản phẩm nào"));
      }

      const availableStock = dbProduct.quantity - dbProduct.sold;
      if (product.quantity > availableStock) {
        return reject(createResponse(400, "Hàng có sẵn không đủ"));
      }

      const cart = await getCartByUserId(userId);
      const existingItem = cart.items.find((item) => {
        return item.productId.toString() === product.productId;
      });

      if (existingItem) {
        existingItem.quantity += product.quantity;
        if (existingItem.quantity > availableStock) {
          return reject(createResponse(400, "Hàng có sẵn không đủ"));
        }
      } else {
        cart.items.push(product);
      }

      await cart.save();

      resolve(cart);
    } catch (error) {
      reject(
        createResponse(400, "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng")
      );
    }
  });

const decrementItemInCart = (userId, productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const cart = await getCartByUserId(userId);
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (!existingItem) {
        return reject(createResponse(400, "Không tìm thấy sản phẩm nào"));
      }

      if (existingItem.quantity === 1) {
        await removeItemFromCart(userId, productId);
      } else {
        existingItem.quantity -= 1;
      }

      await cart.save();

      resolve(cart);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi giảm số lượng sản phẩm"));
    }
  });

const incrementItemInCart = (userId, productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const cart = await getCartByUserId(userId);
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (!existingItem) {
        return reject(createResponse(400, "Không tìm thấy sản phẩm"));
      }

      const product = await Product.findById(productId);
      if (!product) {
        return reject(createResponse(400, "Không tìm thấy sản phẩm"));
      }

      const availableStock = product.quantity - product.sold;

      if (existingItem.quantity + 1 > availableStock) {
        return reject(createResponse(400, "Số lượng yêu cầu vượt quá tồn kho"));
      }

      existingItem.quantity += 1;
      await cart.save();

      resolve(cart);
    } catch (error) {
      reject(
        createResponse(
          400,
          "Đã xảy ra lỗi khi tăng số lượng sản phẩm trong giỏ hàng"
        )
      );
    }
  });

const removeItemFromCart = (userId, productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const cart = await getCartByUserId(userId);
      const itemToRemove = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (itemToRemove) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
        await cart.save();
      }

      resolve(cart);
    } catch (error) {
      reject(
        createResponse(400, "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng")
      );
    }
  });

const clearCart = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { items: [] },
        { new: true }
      );

      resolve(cart);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi xóa giỏ hàng"));
    }
  });

module.exports = {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  decrementItemInCart,
  incrementItemInCart,
};
