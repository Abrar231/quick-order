const mongoose = require("mongoose");
const { mongoUri } = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
