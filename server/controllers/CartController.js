const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Variant = require("../models/Variant");

const addToCart = async (req, res) => {
    try {
      const { variantId, quantity } = req.body;
      
      if (!variantId) {
        return res.status(400).json({ success: false, error: 'Variant ID is required' });
      }
      
      // Check if variant exists
      const variant = await Variant.findOne({ _id: variantId });
      if (!variant) {
        return res.status(404).json({ success: false, error: 'Variant not found' });
      }
      
      // Check if this variant is already in the cart
      const existingItem = await Cart.findOne({ variantId });
      let addedItem = null;
      
      if (existingItem) {
        // Update quantity
        addedItem = await Cart.updateOne({ variantId}, { $set: { quantity } });
      } else {
        // Add new item
        addedItem = await Cart.insertOne({ variantId, quantity });
      }
      
      res.status(200).json({ success: true, message: 'Item added to cart successfully', item: addedItem });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ success: false, error: 'Failed to add item to cart' });
    }
}

const deleteFromCart = async (req, res) => {
    try {
      const { variantId } = req.body;
      
      if (!variantId) {
        return res.status(400).json({ success: false, error: 'Variant ID is required' });
      }
      
      // Remove the item from the cart
      const deletedItem = await Cart.deleteOne({ variantId });
      
      res.json({ success: true, message: 'Item removed from cart successfully', item: deletedItem });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ success: false, error: 'Failed to remove item from cart' });
    }
}

const getCartItems = async (req, res) => {
    try {
      // Get all cart items
      const cartItems = await Cart.find({});
      
      // If cart is empty, return empty array
      if (cartItems.length === 0) {
        return res.json({  success: true, count: 0, items: [] });
      }
      
      // Get all SKUs from cart
      const variantIds = cartItems.map(item => item.variantId);
      
      // Fetch variant details for all cart items
      const variants = await Variant.find({ _id: { $in: variantIds } });
  
      // Create a map of variant details by SKU for quick lookup
      const variantMap = {};
      variants.forEach(variant => {
        variantMap[variant._id.toString()] = variant;
      });
      
      
      // Get all product IDs from variants
      const productIds = variants.map(variant => variant.productId);
      
      // Fetch product details
      const products = await Product.find({ _id: { $in: productIds } });
      
      
      // Create a map of product details by ID for quick lookup
      const productMap = {};
      products.forEach(product => {
        productMap[product._id.toString()] = product;
      });
      
      // Combine all data
      const result = cartItems.map(cartItem => {
        const variant = variantMap[cartItem.variantId];
        
        // Skip if variant not found
        if (!variant) return null;
        
        const product = productMap[variant.productId.toString()];
        
        // Skip if product not found
        if (!product) return null;
        
        return {
          _id: variant._id,
          sku: variant.sku,
          price: variant.price,
          title: variant.title,
          images: product.images,
          quantity: cartItem.quantity,
        };
      }).filter(item => item !== null); // Remove any null items
      
      return res.json({ 
        success: true,
        count: result.length,
        data: result });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch cart items' });
    }
}

module.exports = { addToCart, deleteFromCart, getCartItems }