const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.get("/", (req, res) => {
  res.send("User Page");
});
router.post("/register", userController.createUser);

module.exports = router;
