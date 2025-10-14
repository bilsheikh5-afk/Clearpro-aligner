import User from '../models/User.js';

export const seedDefaultUsers = async () => {
  try {
    const adminEmail = 'admin@clearproaligner.com';
    const doctorEmail = 'doctor@clearproaligner.com';

    // Check existing users
    const existingAdmin = await User.findOne({ email: adminEmail });
    const existingDoctor = await User.findOne({ email: doctorEmail });

    // Create Admin if missing
    if (!existingAdmin) {
      const hashed = await User.hashPassword('clearpro@2025');
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashed,
        role: 'admin',
      });
      console.log('✅ Default admin user created');
    }

    // Create Doctor if missing
    if (!existingDoctor) {
      const hashed = await User.hashPassword('clearpro@2025');
      await User.create({
        name: 'Dr. Sarah Johnson',
        email: doctorEmail,
        password: hashed,
        role: 'doctor',
      });
      console.log('✅ Default doctor user created');
    }
  } catch (err) {
    console.error('❌ Error seeding default users:', err);
  }
};
