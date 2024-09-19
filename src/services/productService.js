const Product = require("../models/productModel");

const getProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId).populate("category");
      if (!product) {
        reject("Sản phẩm không được xác định");
      }

      resolve({ ...product.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi tìm nạp sản phẩm");
    }
  });

const getAllProducts = (page, limit, filter) =>
  new Promise(async (resolve, reject) => {
    const { id, ...rest } = JSON.parse(filter);
    const input = id ? { _id: { $ne: id }, ...rest } : { ...rest };
    try {
      const listProducts = await Product.find(input)
        .populate("category")
        .limit(limit)
        .skip((page - 1) * limit);

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

      const product = await createProduct.populate("category");

      resolve({ ...product.toObject() });
    } catch (error) {
      reject("Đã xảy ra lỗi khi xử lý yêu cầu");
    }
  });

const updateProduct = (productId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndUpdate(productId, body, {
        new: true,
      }).populate("category");

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
