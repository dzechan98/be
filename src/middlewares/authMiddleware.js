const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header is missing or malformed",
    });
  }

  const accessToken = authHeader.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_AT_SECRET_KEY, (err, decode) => {
    if (err) {
      return res.status(401).json({
        message: "Access token may be expired or invalid",
      });
    }
    req.user = decode;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      message: "Require role is Admin",
    });
  }
  console.log(req.user);
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
};
