const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const delayMiddleware = (ms) => {
  return (req, res, next) => {
    setTimeout(() => {
      next();
    }, ms);
  };
};

router.post("/register", delayMiddleware(3000), authController.register);
router.post("/login", delayMiddleware(3000), authController.login);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
