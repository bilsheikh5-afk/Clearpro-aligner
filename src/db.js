import mongoose from 'mongoose';
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/clearpro';
mongoose.connect(uri, { autoIndex: true })
  .then(() => console.log('Mongo connected'))
  .catch((e) => console.error('Mongo error', e));

// Seed admin if missing on initial connect
import './utils/seed.js';
