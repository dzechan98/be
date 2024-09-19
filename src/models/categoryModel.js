const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    slug: { type: String, required: false },
    image_url: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false, versionKey: false },
    toObject: { virtuals: false, versionKey: false },
  }
);

categorySchema.pre("save", function (next) {
  this.slug = this.title.split(" ").join("-");
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  this.slug = this.title.split(" ").join("-");
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
