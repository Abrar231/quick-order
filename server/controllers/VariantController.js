
const Variant = require("../models/Variant");

const searchBySkuOrTitle = async (req, res) => {
    try {
      const searchTerm = req.query.q;
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }
  
      // Create a regex to make the search case insensitive
      const searchRegex = new RegExp(searchTerm, 'i');
      
      // Search in both title and sku fields
      const rawVariants = await Variant.find({
        $or: [
          { title: searchRegex },
          { sku: searchRegex }
        ]
      }).populate({path: 'productId', select: 'images'}).select('title price sku');
  
      const variants = rawVariants.map(variant => ({_id: variant._id, sku: variant.sku, price: variant.price, title: variant.title, images: variant.productId.images}));
  
      return res.status(200).json({
        success: true,
        count: variants.length,
        data: variants,
        searchTerm
      });
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error occurred while searching variants',
        error: error.message
      });
    }
}

module.exports = { searchBySkuOrTitle }