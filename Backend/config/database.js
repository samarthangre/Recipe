import mongoose from "mongoose";

const connectDB = async () => {
    console.log("📡 Trying to connect to MongoDB...");

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

export default connectDB;
