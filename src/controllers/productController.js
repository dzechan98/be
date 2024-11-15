const productService = require("../services/productService");
const errorHandler = require("../utils/errorHandler");

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "productId là bắt buộc" });
    }

    const result = await productService.getProduct(productId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);

    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, price, quantity, category, images, image_thumbnail } =
      req.body;

    if (
      !title ||
      !category ||
      price < 0 ||
      !image_thumbnail ||
      images.length < 0 ||
      quantity < 0
    ) {
      return res.status(400).json({ message: "Đầu vào không đúng định dạng" });
    }

    const result = await productService.addProduct(req.body);
    return res.status(201).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "productId là bắt buộc" });
    }

    const { title, price, quantity, category, images, image_thumbnail } =
      req.body;

    if (
      !title ||
      !category ||
      price < 0 ||
      !image_thumbnail ||
      images.length < 0 ||
      quantity < 0
    ) {
      return res.status(400).json({ message: "Đầu vào không đúng định dạng" });
    }

    const result = await productService.updateProduct(productId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "productId là bắt buộc" });
    }

    const result = await productService.deleteProduct(productId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
