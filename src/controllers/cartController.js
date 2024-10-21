const cartService = require("../services/cartService");

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartByUserId(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (error === "Đã xảy ra lỗi khi tìm nạp giỏ hàng") {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const addItem = async (req, res) => {
  try {
    const product = req.body;
    const cart = await cartService.addItemToCart(req.user.id, product);
    res.status(200).json(cart);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error === "Không tìm thấy sản phẩm" ||
      error === "Hàng có sẵn không đủ" ||
      error === "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng"
    ) {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
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
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error === "Không tìm thấy sản phẩm" ||
      error === "Đã xảy ra lỗi khi giảm số lượng sản phẩm trong giỏ hàng"
    ) {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
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
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error === "Không tìm thấy sản phẩm" ||
      error === "Số lượng yêu cầu vượt quá tồn kho" ||
      error === "Đã xảy ra lỗi khi tăng số lượng sản phẩm trong giỏ hàng"
    ) {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeItemFromCart(req.user.id, productId);
    res.status(200).json(cart);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (error === "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng") {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const clearCart = async (req, res) => {
  console.log(req);
  try {
    const cart = await cartService.clearCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (error === "Đã xảy ra lỗi khi xóa giỏ hàng") {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
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
