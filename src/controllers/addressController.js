const addressService = require("../services/addressService");
const errorHandler = require("../utils/errorHandler");

const getAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    if (!addressId) {
      return res.status(400).json({ message: "addressId là bắt buộc" });
    }

    const result = await addressService.getAddress(addressId);
    return res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
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
    errorHandler(res, error);
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
    errorHandler(res, error);
  }
};

const addAddress = async (req, res) => {
  try {
    const newAddress = req.body;
    const result = await addressService.addAddress(newAddress);
    return res.status(201).json(result);
  } catch (error) {
    errorHandler(res, error);
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
    errorHandler(res, error);
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
    errorHandler(res, error);
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
