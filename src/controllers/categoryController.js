const categoryService = require("../services/categoryService");

const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId là bắt buộc" });
    }

    const result = await categoryService.getCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error == "Danh mục không được xác định" ||
      error == "Đã xảy ra lỗi khi tìm nạp danh mục"
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
      message: "Đã xảy ra lỗi khi tìm nạp danh sách danh mục",
    });
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
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (error === "Đã xảy ra lỗi khi xử lý yêu cầu") {
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
      return res.status(400).json({ message: "categoryId là bắt buộc" });
    }

    const result = await categoryService.updateCategory(categoryId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      (error =
        "Đã xảy ra lỗi khi cập nhật danh mục" ||
        error == "Danh mục không được xác định")
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
      return res.status(400).json({ message: "categoryId là bắt buộc" });
    }

    const result = await categoryService.deleteCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error == "Danh mục không được xác định" ||
      error == "Đã xảy ra lỗi khi xóa danh mục"
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
