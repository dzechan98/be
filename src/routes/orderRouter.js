const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, isAdmin, orderController.getAllOrder);
router.get("/user", verifyToken, orderController.getOrdersByUser);
router.post("/", verifyToken, orderController.createOrder);
router.put("/cancel-order", verifyToken, orderController.cancelOrder);
router.put(
  "/update-status/:id",
  verifyToken,
  orderController.updateStatusOrder
);

module.exports = router;
