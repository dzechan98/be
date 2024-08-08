const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/:id", verifyToken, userController.getUser);
router.get("/", verifyToken, isAdmin, userController.getAllUser);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
