const categoryService = require("../services/categoryService");

const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({ message: "The categoryId is required" });
    }

    const result = await categoryService.getCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (
      error == "The category is not defined" ||
      error == "An error occurred while fetching the category"
    ) {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await categoryService.getAllCategories(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching the categories",
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const image_url = req.file.path;
    const slug = title.toLowerCase().split(" ").join("-");

    if (!title) {
      return res.status(400).json({
        message: "Input is malformed",
      });
    }

    const result = await categoryService.addCategory({
      title,
      image_url,
      slug,
    });
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

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({ message: "The categoryId is required" });
    }

    const image_url = req.file.path || "";
    const { title } = req.body;
    const slug = title ? title.toLowerCase().split(" ").join("-") : "";
    const data = slug ? { title, slug, image_url } : { image_url, ...req.body };

    const result = await categoryService.updateCategory(categoryId, data);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (
      (error =
        "An error occurred while updating the category" ||
        error == "The category is not defined")
    ) {
      statusCode = 400;
      message = error;
    }
    return res.status(statusCode).json({ message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({ message: "The categoryId is required" });
    }

    const result = await categoryService.deleteCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Internal server error";

    if (
      error == "The category is not defined" ||
      error == "An error occurred while deleting the category"
    ) {
      statusCode = 400;
      message = error;
    }
    return res.status(500).json({ message });
  }
};

module.exports = {
  getCategory,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
