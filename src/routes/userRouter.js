const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  verifyToken,
  isUserOrAdmin,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.get("/:id", verifyToken, isUserOrAdmin, userController.getUser);
router.get("/profile/me", verifyToken, userController.getMe);
router.get("/", verifyToken, isAdmin, userController.getAllUsers);
router.post("/", verifyToken, isAdmin, userController.addUser);
router.put("/:id", verifyToken, isUserOrAdmin, userController.updateUser);
router.delete("/:id", verifyToken, isUserOrAdmin, userController.deleteUser);

module.exports = router;
