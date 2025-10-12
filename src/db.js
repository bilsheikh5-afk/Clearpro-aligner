import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/clearpro';

async function connectDB() {
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log('✅ MongoDB connected successfully');

    // Import seeding only after successful connection
    await import('./utils/seed.js');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Stop the app if DB connection fails
  }
}

connectDB();
