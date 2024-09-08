const productService = require("../services/productService");

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "The productId is required" });
    }

    const result = await productService.getProduct(productId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (
      error == "The product is not defined" ||
      error == "An error occurred while fetching the product"
    ) {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "asc" } = req.query;
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "filter"];
    excludeFields.forEach((item) => delete queryObj[item]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log(queryStr);
    const result = await productService.getAllProducts(
      page,
      limit,
      sort,
      queryStr
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, price, description, quantity, category, brand, color } =
      req.body;

    if (
      !title ||
      !description ||
      !category ||
      !brand ||
      !color ||
      price < 0 ||
      quantity < 0
    ) {
      return res.status(400).json({ message: "Input is malformed" });
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
      return res.status(400).json({ message: "The productId is required" });
    }

    if (
      req.body.countInStock < 0 ||
      req.body.rating < 0 ||
      req.body.price < 0
    ) {
      return res.status(400).json({ message: "Input is malformed" });
    }

    const result = await productService.updateProduct(productId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (
      (error =
        "An error occurred while updating the product" ||
        error == "The product is not defined")
    ) {
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
      return res.status(400).json({ message: "The productId is required" });
    }

    const result = await productService.deleteProduct(productId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (
      error == "The product is not defined" ||
      error == "An error occurred while deleting the product"
    ) {
      statusCode = 400;
      message = error;
    }
    return res.status(500).json({ message });
  }
};

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
