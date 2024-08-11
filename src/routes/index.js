const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter);
};

module.exports = routes;
