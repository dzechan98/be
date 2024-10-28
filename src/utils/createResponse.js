const createResponse = (statusCode, message) => {
  return {
    statusCode,
    message,
  };
};

module.exports = createResponse;
