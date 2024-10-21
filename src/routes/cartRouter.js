const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, cartController.getCart);
router.post("/", verifyToken, cartController.addItem);
router.delete("/clear", verifyToken, cartController.clearCart);
router.put("/:productId", verifyToken, cartController.incrementItem);
router.delete("/:productId", verifyToken, cartController.decrementItem);
router.delete("/remove/:productId", verifyToken, cartController.removeItem);

module.exports = router;
