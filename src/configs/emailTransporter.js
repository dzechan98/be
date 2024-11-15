require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 10,
  rateLimit: 1,
});

module.exports = transporter;
