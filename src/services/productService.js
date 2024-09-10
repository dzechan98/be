const Product = require("../models/productModel");

const getProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        reject("Sản phẩm không được xác định");
      }

      resolve({ ...product.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi tìm nạp sản phẩm");
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

      resolve({ results: listProducts, count });
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

      resolve({ ...createProduct.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xử lý yêu cầu");
    }
  });

const updateProduct = (productId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndUpdate(productId, body, {
        new: true,
      });

      if (!product) {
        return reject("Sản phẩm không được xác định");
      }

      resolve({
        ...product.toObject(),
      });
    } catch (error) {
      reject("Đã xảy ra lỗi khi cập nhật sản phẩm");
    }
  });

const deleteProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return reject("Sản phẩm không được xác định");
      }

      resolve({ message: "Delete product success" });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xóa sản phẩm");
    }
  });

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
