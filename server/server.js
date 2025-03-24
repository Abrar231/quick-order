// Express + Next JS server combination - server.js
const express = require("express");
const next = require("next");
const { createServer } = require("http");
const dotenv = require("dotenv");
const connectDB = require("./db");
const Cart = require("./models/Cart");
const Product = require("./models/Product");
const Variant = require("./models/Variant");
const { Server } = require("socket.io");
const { parseQuery, processProductsData, processVariants } = require("./util");
const { addToProductList, getAllProducts, deleteAllProductsAndVariants } = require("./controllers/ProductController");
const { searchBySkuOrTitle } = require("./controllers/VariantController");
const {addToCart, deleteFromCart, getCartItems} = require("./controllers/CartController");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

dotenv.config();
connectDB();

const server = express();

const httpServer = createServer(server);
server.use(express.json({ limit: '1mb' }));

const io = new Server(httpServer);


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


// For testing Purpose Onmly
server.get("/api/myapi", async (req, res) => {
  async function generateMongoQuery(userQuery) {
    const prompt = `
    Convert the following user query into a valid MongoDB filter JSON:
    Query: "${userQuery}"
    Output should only contain valid JSON, no explanations.

    2 collections Product and Variant
    Product has title, body, vendor, type, and tags fields
    Variant has SKU, quantity, and price fields
    Examples:
    "Find SKU 12345" → { "sku": {$regex: "12345", $options: 'i' } for Variant
    "Show electronics under $50" → { "type": {$regex: "electronics", $options: 'i'}, "price": { "$lt": 50 } } for join of Product and Variant
    "Find all products above $100" → { "price": { "$gt": 100 } } for Variant
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "system", content: prompt }],
        temperature: 0.2
    });
    return response.choices[0].message.content;
  }

    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        // Convert the query into a MongoDB filter
        const mongoFilter = await generateMongoQuery(message);

        // Query MongoDB
        const results = await Product.find(JSON.parse(mongoFilter)).limit(10);
        res.json({ query: mongoFilter, results });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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

server.get("*", (req, res) => {
    return handle(req, res);
});

app.prepare().then(() => {
  // Start listening to the Express.js Server

  httpServer.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(`Express Server running on ${process.env.NEXT_PUBLIC_SERVER_URL}`);
  });
});