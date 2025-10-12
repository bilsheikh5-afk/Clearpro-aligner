import User from '../models/User.js';
import mongoose from 'mongoose';

async function ensureSeed() {
  try {
    const email = 'admin@clearproaligner.com';
    let admin = await User.findOne({ email });
    if (!admin) {
      const passwordHash = await User.hashPassword('admin123');
      admin = await User.create({ name: 'Admin User', email, passwordHash, role: 'admin' });
      console.log('Seeded admin user');
    }
    // Also seed a demo doctor
    const docEmail = 'doctor@example.com';
    let doctor = await User.findOne({ email: docEmail });
    if (!doctor) {
      const passwordHash = await User.hashPassword('doctor123');
      doctor = await User.create({ name: 'Dr. Sarah Johnson', email: docEmail, passwordHash, role: 'doctor' });
      console.log('Seeded demo doctor');
    }
  } catch (e) {
    console.error('Seed error', e.message);
  }
}

// only run when Mongoose is connected
if (mongoose.connection.readyState >= 1) {
  ensureSeed();
} else {
  mongoose.connection.once('open', ensureSeed);
}

export default {};
