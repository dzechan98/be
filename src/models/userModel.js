const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    isAdmin: { type: Boolean, default: false, required: false },
    image: { type: String, required: false },
    phone: { type: String, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false, versionKey: false },
    toObject: { virtuals: false, versionKey: false },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
