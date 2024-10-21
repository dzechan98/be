const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    ward: { type: String },
    district: { type: String },
    city: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false, versionKey: false },
    toObject: { virtuals: false, versionKey: false },
  }
);

module.exports = mongoose.model("Address", addressSchema);
