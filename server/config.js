require('dotenv').config();
module.exports = {
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
}