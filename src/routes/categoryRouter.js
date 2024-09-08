const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../upload");

router.get("/:id", categoryController.getCategory);
router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  categoryController.addCategory
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  categoryController.updateCategory
);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
