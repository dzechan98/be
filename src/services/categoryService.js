const Category = require("../models/categoryModel");
const createResponse = require("../utils/createResponse");

const getCategory = (categoryId) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return reject(createResponse(400, "Danh mục không được xác định"));
      }

      resolve(category);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi tìm nạp danh mục"));
    }
  });

const getAllCategories = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const listCategories = await Category.find()
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await Category.countDocuments();

      resolve({ results: listCategories, count });
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi tìm nạp danh mục"));
    }
  });

const addCategory = (newCategory) =>
  new Promise(async (resolve, reject) => {
    try {
      const createCategory = await Category.create({ ...newCategory });

      resolve(createCategory);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi thêm danh mục"));
    }
  });

const updateCategory = (categoryId, body) =>
  new Promise(async (resolve, reject) => {
    const slug = body?.title.split(" ").join("-");
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { ...body, slug },
        {
          new: true,
        }
      );

      if (!category) {
        return reject(createResponse(400, "Danh mục không được xác định"));
      }

      resolve(category);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi cập nhật danh mục"));
    }
  });

const deleteCategory = (categoryId) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findByIdAndDelete(categoryId);

      if (!category) {
        return reject(createResponse(400, "Danh mục không được xác định"));
      }

      resolve({ message: "Xóa danh mục thành công" });
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi xóa danh mục"));
    }
  });

module.exports = {
  getCategory,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
