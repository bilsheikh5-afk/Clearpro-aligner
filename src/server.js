import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import { seedDefaultUsers } from './utils/seedUsers.js';

dotenv.config();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// 🟢 Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');

    // Seed default admin and doctor if missing
    await seedDefaultUsers();

    app.listen(PORT, () => {
      console.log(`🚀 API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
