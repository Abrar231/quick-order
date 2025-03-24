const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
    quantity: Number,
});

module.exports = mongoose.model("Cart", CartSchema);
