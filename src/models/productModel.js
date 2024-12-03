const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sold: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    image_thumbnail: { type: String },
    images: { type: Array },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false, versionKey: false },
    toObject: { virtuals: false, versionKey: false },
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
