const Category = require("../models/categoryModel");

const getCategory = (categoryId) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        resolve({ message: "The category is not defined" });
      }

      resolve({ data: category });
    } catch (error) {
      reject("An error occurred while fetching the category");
    }
  });

const getAllCategories = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const listCategories = await Category.find()
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await Category.countDocuments();
      const totalPage = Math.ceil(count / limit);

      resolve({ results: { data: listCategories, totalPage } });
    } catch (error) {
      reject("An error occurred while fetching the categories");
    }
  });

const addCategory = (newCategory) =>
  new Promise(async (resolve, reject) => {
    try {
      const createCategory = await Category.create({ ...newCategory });

      resolve({ data: createCategory });
    } catch (error) {
      console.log(error);
      reject("An error occurred while processing the request");
    }
  });

const updateCategory = (categoryId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const { image_url, ...rest } = body;
      const data = image_url ? body : rest;
      const category = await Category.findByIdAndUpdate(categoryId, data, {
        new: true,
      });

      if (!category) {
        return resolve({ message: "The category is not defined" });
      }

      resolve({
        message: "Update category success",
        data: category,
      });
    } catch (error) {
      reject("An error occurred while updating the category");
    }
  });

const deleteCategory = (categoryId) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findByIdAndDelete(categoryId);

      if (!category) {
        return resolve({ message: "The category is not defined" });
      }

      resolve({ message: "Delete category success" });
    } catch (error) {
      reject("An error occurred while deleting the category");
    }
  });

module.exports = {
  getCategory,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
