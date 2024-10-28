const categoryService = require("../services/categoryService");
const errorHandler = require("../utils/errorHandler");

const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId là bắt buộc" });
    }

    const result = await categoryService.getCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await categoryService.getAllCategories(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addCategory = async (req, res) => {
  try {
    const { title, image_url } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({
        message: "Đầu vào không đúng định dạng",
      });
    }

    const result = await categoryService.addCategory({ title, image_url });
    return res.status(201).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId là bắt buộc" });
    }

    const result = await categoryService.updateCategory(categoryId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId là bắt buộc" });
    }

    const result = await categoryService.deleteCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getCategory,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
