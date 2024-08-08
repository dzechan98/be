const authRouter = require("./authRouter");
const userRouter = require("./userRouter");

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
};

module.exports = routes;
