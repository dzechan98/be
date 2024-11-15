const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const cartRouter = require("./cartRouter");
const addressRouter = require("./addressRouter");
const orderRouter = require("./orderRouter");
const overviewRouter = require("../routes/overviewRouter");

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/addresses", addressRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/overview", overviewRouter);
};

module.exports = routes;
