const Category = require("../models/categoryModel");

const getCategory = (categoryId) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        resolve({ message: "Danh mục không được xác định" });
      }

      resolve({ ...category.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi tìm nạp danh mục");
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
      reject("Đã xảy ra lỗi khi tìm nạp danh sách danh mục");
    }
  });

const addCategory = (newCategory) =>
  new Promise(async (resolve, reject) => {
    try {
      const createCategory = await Category.create({ ...newCategory });

      resolve({ ...createCategory.toObject() });
    } catch (error) {
      console.log(error);
      reject("Đã xảy ra lỗi khi xử lý yêu cầu");
    }
  });

const updateCategory = (categoryId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const { image_url, title } = body;
      const data = image_url ? body : { title };
      const category = await Category.findByIdAndUpdate(categoryId, data, {
        new: true,
      });

      if (!category) {
        return resolve("Danh mục không được xác định");
      }

      resolve({ ...category.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi cập nhật danh mục");
    }
  });

const deleteCategory = (categoryId) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findByIdAndDelete(categoryId);

      if (!category) {
        return resolve({ message: "Danh mục không được xác định" });
      }

      resolve({ message: "Delete category success" });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xóa danh mục");
    }
  });

module.exports = {
  getCategory,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
