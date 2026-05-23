import mongoose from "mongoose";

// mongoDB-connection 🟢

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🛜 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ ERROR connecting to DATABASE: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
