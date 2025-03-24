const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  handle: String,
  title: String,
  body: String,
  type: String,
  vendor: String,
  tags: [String],
  images: [String],
});

module.exports = mongoose.model("Product", ProductSchema);
