const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/:id", categoryController.getCategory);
router.get("/", categoryController.getAllCategories);
router.post("/", verifyToken, isAdmin, categoryController.addCategory);
router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
