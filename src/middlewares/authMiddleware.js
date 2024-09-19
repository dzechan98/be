const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Không được ủy quyền hoặc không đúng định dạng",
    });
  }

  const accessToken = authHeader.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_AT_SECRET_KEY, (err, decode) => {
    if (err) {
      return res.status(401).json({
        message: "Access token có thể đã hết hạn hoặc không hợp lệ",
      });
    }
    req.user = decode;
    console.log("req.user", req.user);
    next();
  });
};

const isUserOrAdmin = (req, res, next) => {
  const userId = req.params.id;
  const { id, isAdmin } = req.user;

  if (id !== userId && !isAdmin) {
    return res.status(403).json({
      message:
        "Truy cập bị từ chối. Bạn không có quyền thực hiện hành động này.",
    });
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      message: "Yêu cầu vai trò là Quản trị viên",
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isUserOrAdmin,
  isAdmin,
};
