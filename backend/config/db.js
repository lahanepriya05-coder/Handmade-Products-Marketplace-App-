import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not set. Running with in-memory fallback.");
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message} ❌`);
    console.warn("Continuing with in-memory fallback.");
    return false;
  }
};

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
