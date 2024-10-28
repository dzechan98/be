const Address = require("../models/addressModel");
const createResponse = require("../utils/createResponse");

const getAddress = (addressId) =>
  new Promise(async (resolve, reject) => {
    try {
      const address = await Address.findById(addressId);
      if (!address) {
        reject(createResponse(400, "Địa chỉ không được xác định"));
      } else {
        resolve(address);
      }
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi tìm nạp địa chỉ"));
    }
  });

const getAddressDefault = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const address = await Address.findOne({ userId, isDefault: true });

      if (!address) {
        reject(createResponse(400, "Không tìm thấy địa chỉ mặc định"));
      } else {
        resolve(address);
      }
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi tìm nạp địa chỉ mặc định"));
    }
  });

const getManyAddresses = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const addresses = await Address.find({ userId }).sort({ isDefault: -1 });
      const count = await Address.countDocuments();

      if (!addresses || addresses.length === 0) {
        reject(createResponse(400, "Không tìm thấy địa chỉ"));
      } else {
        resolve({ results: addresses, count });
      }
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi tìm nạp địa chỉ"));
    }
  });

const addAddress = (newAddress) =>
  new Promise(async (resolve, reject) => {
    try {
      const { isDefault, userId } = newAddress;

      if (isDefault) {
        await Address.updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } }
        );
      }

      const address = new Address(newAddress);

      const savedAddress = await address.save();
      resolve(savedAddress);
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi thêm địa chỉ"));
    }
  });

const updateAddress = (addressId, updatedData) =>
  new Promise(async (resolve, reject) => {
    try {
      const { isDefault, userId } = updatedData;

      if (isDefault) {
        await Address.updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } }
        );
      }

      const address = await Address.findByIdAndUpdate(addressId, updatedData, {
        new: true,
      });

      if (!address) {
        reject(createResponse(400, "Địa chỉ không được xác định"));
      } else {
        resolve(address);
      }
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi cập nhật địa chỉ"));
    }
  });

const deleteAddress = (addressId) =>
  new Promise(async (resolve, reject) => {
    try {
      const address = await Address.findByIdAndDelete(addressId);
      if (!address) {
        reject(createResponse(400, "Địa chỉ không được xác định"));
      } else {
        resolve({ message: "Đã xóa địa chỉ thành công" });
      }
    } catch (error) {
      reject(createResponse(400, "Đã xảy ra lỗi khi xóa địa chỉ"));
    }
  });

module.exports = {
  getAddress,
  getAddressDefault,
  addAddress,
  getManyAddresses,
  updateAddress,
  deleteAddress,
};
