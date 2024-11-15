const Product = require("../models/productModel");
const createResponse = require("../utils/createResponse");

const getProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId).populate("category");
      if (!product) {
        return reject(createResponse(400, "Sản phẩm không được xác định"));
      }

      resolve(product);
    } catch (error) {
      reject(createResponse(400, "Đã có lỗi xảy ra khi tìm nạp sản phẩm"));
    }
  });

const getAllProducts = (body) =>
  new Promise(async (resolve, reject) => {
    const {
      page = 1,
      limit = 10,
      title,
      listCategories,
      id,
      sortBy = "sold",
      sortOrder = "desc",
    } = body;

    let input = id ? { _id: { $ne: id } } : {};

    input = title
      ? { ...input, title: { $regex: title, $options: "i" } }
      : input;

    input = listCategories
      ? { ...input, category: { $in: listCategories.split(",") } }
      : input;

    try {
      const listProducts = await Product.find(input)
        .populate("category")
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await Product.countDocuments(input);

      resolve({ results: listProducts, count });
    } catch (error) {
      reject(createResponse(400, "Đã có lỗi xảy ra khi tìm nạp sản phẩm"));
    }
  });

const addProduct = (newProduct) =>
  new Promise(async (resolve, reject) => {
    try {
      const createProduct = await Product.create({
        ...newProduct,
      });

      const product = await createProduct.populate("category");

      resolve(product);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi thêm sản phẩm"));
    }
  });

const updateProduct = (productId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndUpdate(productId, body, {
        new: true,
      }).populate("category");

      if (!product) {
        return reject(createResponse(400, "Sản phẩm không được xác định"));
      }

      resolve(product);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi cập nhật sản phẩm"));
    }
  });

const deleteProduct = (productId) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return reject(createResponse(400, "Sản phẩm không được xác định"));
      }

      resolve({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi xóa sản phẩm"));
    }
  });

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
