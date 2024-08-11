const productService = require("../services/productService");

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const result = await productService.getProduct(productId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching the product",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching the products",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } =
      req.body;

    if (
      !name ||
      !image ||
      !type ||
      !description ||
      price < 0 ||
      countInStock < 0 ||
      rating < 0
    ) {
      return res.status(400).json({
        message: "Input is malformed",
      });
    }

    const result = await productService.addProduct(req.body);
    return res.status(201).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (error === "An error occurred while processing the request") {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    if (
      req.body.countInStock < 0 ||
      req.body.rating < 0 ||
      req.body.price < 0
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Input is malformed",
      });
    }

    const result = await productService.updateProduct(productId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "";

    if ((error = "An error occurred while updating the product")) {
      statusCode = 400;
      message = error;
    }
    return res.status(statusCode).json({ message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const result = await productService.deleteProduct(productId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting the product",
    });
  }
};

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
