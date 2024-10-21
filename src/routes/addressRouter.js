const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, addressController.getManyAddresses);
router.get("/default", verifyToken, addressController.getAddressDefault);
router.get("/:id", verifyToken, addressController.getAddress);
router.post("/", verifyToken, addressController.addAddress);
router.put("/:id", verifyToken, addressController.updateAddress);
router.delete("/:id", verifyToken, addressController.deleteAddress);

module.exports = router;
