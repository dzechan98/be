const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "cash_on_delivery", "bank_transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: Number, required: true },
    },
    orderDate: { type: Date, default: Date.now },
    shippedDate: { type: Date },
    deliveredDate: { type: Date },
    canceledDate: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false, versionKey: false },
    toObject: { virtuals: false, versionKey: false },
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
