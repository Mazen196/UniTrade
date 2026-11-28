const mongoose = require("mongoose");

// Connects to MongoDB Atlas using the link stored in .env
async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Create a .env file (see .env.example).");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
