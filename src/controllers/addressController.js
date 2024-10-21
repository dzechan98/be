const addressService = require("../services/addressService");

const getAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    if (!addressId) {
      return res.status(400).json({ message: "addressId là bắt buộc" });
    }

    const result = await addressService.getAddress(addressId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error === "Địa chỉ không được xác định" ||
      error === "Đã xảy ra lỗi khi tìm nạp địa chỉ"
    ) {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const getAddressDefault = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "userId là bắt buộc" });
    }

    const result = await addressService.getAddressDefault(userId);
    if (result.message) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ khi tìm nạp địa chỉ mặc định" });
  }
};

const getManyAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "user_id là bắt buộc" });
    }

    const result = await addressService.getManyAddresses(userId);
    return res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    let message = "Lỗi máy chủ";

    if (
      error === "Không tìm thấy địa chỉ" ||
      error === "Đã xảy ra lỗi khi tìm nạp địa chỉ"
    ) {
      statusCode = 400;
      message = error;
    }

    return res.status(statusCode).json({ message });
  }
};

const addAddress = async (req, res) => {
  try {
    const newAddress = req.body;
    const result = await addressService.addAddress(newAddress);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi máy chủ khi thêm địa chỉ" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updatedData = req.body;

    if (!addressId) {
      return res.status(400).json({ message: "addressId là bắt buộc" });
    }

    const result = await addressService.updateAddress(addressId, updatedData);
    if (result.message) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ khi cập nhật địa chỉ" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    if (!addressId) {
      return res.status(400).json({ message: "addressId là bắt buộc" });
    }

    const result = await addressService.deleteAddress(addressId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi máy chủ khi xóa địa chỉ" });
  }
};

module.exports = {
  getAddress,
  getAddressDefault,
  getManyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
