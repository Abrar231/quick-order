// Express + Next JS server combination - server.js
const express = require("express");
const { createServer } = require("http");
const connectDB = require("../db");
const Variant = require("../models/Variant");
const { Server } = require("socket.io");
const { parseQuery } = require("../util");
const { addToProductList, getAllProducts, deleteAllProductsAndVariants } = require("../controllers/ProductController");
const { searchBySkuOrTitle } = require("../controllers/VariantController");
const {addToCart, deleteFromCart, getCartItems} = require("../controllers/CartController");
const { port, allowedOrigins } = require("../config");
const cors = require('cors');

connectDB();

const server = express();

server.use(express.json({ limit: '1mb' }));

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
};
server.use(cors(corsOptions));

const httpServer = createServer(server);
const io = new Server(httpServer, {cors: corsOptions});


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("userQuery", async (query) => {
    try {
      const filters = parseQuery(query);
      
      if (Object.keys(filters).length === 0) {
        return res.json({ message: "Sorry, I didn't understand your query." });
      }

      // Fetch data from MongoDB
      let results = [];
      if(filters.sku){
        results = await Variant.find(filters);
      }

      if(filters.type && filters.price){
        results = await Variant.aggregate([
          {
            $lookup: {
              from: 'products', 
              localField: 'productId', 
              foreignField: '_id',
              as: 'product',
            },
          },
          {
            $unwind: '$product', // Unwind the product array
          },
          {
            $match: {
              'product.type': { $regex: filters.type['$regex'], $options: 'i' }, // Filter by product type
              price: { $lt: filters.price['$lt'] }, // Filter by variant price
            },
          },
          {
            $project: {
              _id: 0, 
              'product.title': 1,
              'product.type': 1, 
              price: 1, 
              sku: 1, 
            },
          },
        ]);
      }

      return socket.emit("botResponse", { results: results.length ? results : "No matching records found." });
    } catch (error) {
      return socket.emit("botResponse", { message: "Invalid query format.", error });
    }

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
})});


// 1. POST /product-list - Populate Product and Variant Collections
server.post('/api/product-list', addToProductList);

// 2. GET /product-list - Get all products with their variants
server.get('/api/product-list', getAllProducts);

// 2. DELETE /product-list - Delete all products and variants
server.delete('/api/product-list', deleteAllProductsAndVariants);

// 3. GET /search - Search by Variant SKU or title
server.get('/api/search', searchBySkuOrTitle);

// POST /cart - Add a product to cart
server.post('/api/cart', addToCart);

// DELETE /cart - Remove a product from cart
server.delete('/api/cart', deleteFromCart);

// GET /cart - Get user's cart with product details
server.get('/api/cart', getCartItems);

httpServer.listen(port, (err) => {
  if (err) throw err;
  console.log(`Express Server running on Port ${port}`);
});

module.exports = server; 