const Product = require("../models/Product");
const Variant = require("../models/Variant");
const { processProductsData, processVariants } = require("../util");

const getAllVariantsWithImage = async () => {
  try {
    const variants = await Variant.find({})
        .populate({
          path: 'productId',
          select: 'images',
        })
        .select('title price sku');
      
      return variants.map(variant => ({_id: variant._id, sku: variant.sku, price: variant.price, title: variant.title, images: variant.productId.images}));
  } catch (error) {
    console.error('Error fetching variants:', error);
  }
}

const addToProductList = async (req, res) => {
    try {
      const productsData = req.body;
      
      if (!Array.isArray(productsData)) {
        return res.status(400).json({ success: false, error: 'Invalid data format. Expected an array.' });
      }
      
      // Process products
      const products = processProductsData(productsData);
      
      // Insert products
      const productsResult = await Product.insertMany(products);
      
      // Create a map of product handles to their MongoDB IDs
      const productIdMap = new Map();
      for (let i = 0; i < products.length; i++) {
        productIdMap.set(products[i].handle, productsResult[i]._id);
      }
      
      // Process variants with product IDs
      const variants = processVariants(productsData);
      const variantsWithProductIds = variants.map(variant => {
        const productId = productIdMap.get(variant.handle);
        // Remove the temporary handle field
        const { handle, ...variantWithoutHandle } = variant;
        return {
          ...variantWithoutHandle,
          productId: productId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
      
      // Insert variants
      const variantsResult = await Variant.insertMany(variantsWithProductIds);

      const results = await getAllVariantsWithImage();

      res.status(201).json({
        success: true,
        message: 'Data imported successfully',
        productsInserted: productsResult.length,
        variantsInserted: variantsResult.length,
        data: results
      });
    } catch (error) {
      console.error('Error importing data:', error);
      res.status(500).json({ success: false, error: 'Failed to import data' });
    }
}

const getAllProducts = async (req, res) => {
    try {
      const variants = await getAllVariantsWithImage();
      
      res.json({
        success: true,
        count: variants.length,
        data: variants});
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
}

const deleteAllProductsAndVariants = async (req, res) => {
  try {
    
    // Delete all products and variants
    await Product.deleteMany({});
    await Variant.deleteMany({});
    
    res.json({ success: true, message: 'All products and variants deleted successfully' });
  } catch (error) {
    console.error('Error deleting products:', error);
    res.status(500).json({ success: false, error: 'Failed to delete products' });
  }
}

module.exports = {
    addToProductList, getAllProducts, deleteAllProductsAndVariants
};