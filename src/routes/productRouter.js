const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const delayMiddleware = (ms) => {
  return (req, res, next) => {
    setTimeout(() => {
      next();
    }, ms);
  };
};

router.get("/:id", productController.getProduct);
router.get("/", delayMiddleware(1500), productController.getAllProducts);
router.post("/", verifyToken, isAdmin, productController.addProduct);
router.put("/:id", verifyToken, isAdmin, productController.updateProduct);
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
