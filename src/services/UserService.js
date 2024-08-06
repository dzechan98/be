const createUser = (body) =>
  new Promise((resolve, reject) => {
    try {
      resolve(body);
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  createUser,
};
