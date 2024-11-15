const express = require("express");
const router = express.Router();
const overviewController = require("../controllers/overviewController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, isAdmin, overviewController.getDashboardStats);

module.exports = router;
