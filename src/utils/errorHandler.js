const errorHandler = (res, error) => {
  const { statusCode = 500, message = "Lỗi máy chủ" } = error;

  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
