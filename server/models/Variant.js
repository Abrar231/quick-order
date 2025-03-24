const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
    sku: String,
    grams: Number,
    tracker: String,
    inventoryQuantity: Number,
    inventoryPolicy: String,
    fulfillmentService: String,
    price: Number,
    compareAtPrice: Number,
    options: Object,
    title: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, 
});

module.exports = mongoose.model("Variant", VariantSchema);
