// Function to parse user input and convert it into a MongoDB query
const parseQuery = (query) => {
    const filters = {};
  
    // Match SKU query: "Find SKU 12345"
    const skuMatch = query.match(/find sku ([a-zA-Z0-9]+)/i);
    if (skuMatch) {
      filters.sku = { $regex: skuMatch[1], $options: 'i' };
    }
  
    // Match Category and Price query: "Show electronics under $50"
    const categoryPriceMatch = query.match(/show (\w+) under \$(\d+)/i);
    if (categoryPriceMatch) {
      filters.type = { $regex: categoryPriceMatch[1], $options: 'i' };
      filters.price = { $lt: parseInt(categoryPriceMatch[2], 10) }; // Price filter
    }
  
    return filters;
};

// Process Product data to organize by products and variants
function processProductsData(data) {
    const productsMap = new Map();
    
    // First pass: Group items by handle
    data.forEach(item => {
      if (!productsMap.has(item.Handle)) {
        productsMap.set(item.Handle, {
          handle: item.Handle,
          title: item.Title || '',
          body: item.Body || '',
          vendor: item.Vendor || '',
          type: item.Type || '',
          tags: item.Tags ? item.Tags.split(', ') : [],
          images: []
        });
      }
      
      const productData = productsMap.get(item.Handle);
      
      // Add image if it exists
      if (item["Image Src"]) {
        productData.images.push(item["Image Src"]);
      }
    });
    
    return Array.from(productsMap.values());
  }
  
  // Process variants from Products data
  function processVariants(data) {
    const variants = [];
    
    data.forEach(item => {
      // Only process items with SKU (real variants)
      if (item["Variant SKU"]) {
        // Extract options
        const options = {};
        if (item["Option1 Name"] && item["Option1 Value"]) {
          options[item["Option1 Name"]] = item["Option1 Value"];
        }
        if (item["Option2 Name"] && item["Option2 Value"]) {
          options[item["Option2 Name"]] = item["Option2 Value"];
        }
        if (item["Option3 Name"] && item["Option3 Value"]) {
          options[item["Option3 Name"]] = item["Option3 Value"];
        }
        
        variants.push({
          handle: item.Handle, // Temporary field to link with product later
          sku: item["Variant SKU"],
          price: parseFloat(item["Variant Price"]) || 0,
          compareAtPrice: item["Variant Compare At Price"] ? parseFloat(item["Variant Compare At Price"]) : null,
          grams: parseInt(item["Variant Grams"]) || 0,
          tracker: item["Variant Inventory Tracker"] || '',
          inventoryQuantity: parseInt(item["Variant Inventory Qty"]) || 0,
          inventoryPolicy: item["Variant Inventory Policy"] || 'deny',
          fulfillmentService: item["Variant Fulfillment Service"] || 'manual',
          options: options,
          title: item.Title || '' // Store title for search functionality
        });
      }
    });
    
    return variants;
  }

module.exports = {parseQuery, processVariants, processProductsData};