const Product = require("../models/productModel");

const getProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        reject("The product is not defined");
      }

      resolve({ data: product });
    } catch (error) {
      reject("An error occurred while fetching the product");
    }
  });

const getAllProducts = (page, limit, sort, filter) =>
  new Promise(async (resolve, reject) => {
    try {
      const listProducts = await Product.find(JSON.parse(filter))
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ price: sort });

      const count = await Product.countDocuments();
      const totalPage = Math.ceil(count / limit);

      resolve({ results: { data: listProducts, totalPage } });
    } catch (error) {
      console.log(error);
      reject("An error occurred while fetching the products");
    }
  });

const addProduct = (newProduct) =>
  new Promise(async (resolve, reject) => {
    try {
      const createProduct = await Product.create({
        ...newProduct,
      });

      resolve({ data: createProduct });
    } catch (error) {
      reject("An error occurred while processing the request");
    }
  });

const updateProduct = (productId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndUpdate(productId, body, {
        new: true,
      });

      if (!product) {
        return reject("The product is not defined");
      }

      resolve({
        message: "Update product success",
        data: product,
      });
    } catch (error) {
      reject("An error occurred while updating the product");
    }
  });

const deleteProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return reject("The product is not defined");
      }

      resolve({ message: "Delete product success" });
    } catch (error) {
      reject("An error occurred while deleting the product");
    }
  });

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
