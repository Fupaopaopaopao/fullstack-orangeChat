import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const conn = await mongoose.connect(uri!);
    console.log(`mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
