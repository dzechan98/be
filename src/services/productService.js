const Product = require("../models/productModel");

const getProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        data: product,
      });
    } catch (error) {
      reject("An error occurred while fetching the product");
    }
  });

const getAllProducts = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const listProducts = await Product.find()
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await Product.countDocuments();
      const totalPage = Math.ceil(count / limit);

      resolve({
        status: "OK",
        results: {
          data: listProducts,
          totalPage,
        },
      });
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

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: createProduct,
      });
    } catch (error) {
      console.log(error);
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
        return resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Update product success",
        data: product,
      });
    } catch (error) {
      console.log(error);
      reject("An error occurred while updating the product");
    }
  });

const deleteProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Delete product success",
      });
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
