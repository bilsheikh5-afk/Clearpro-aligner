import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // ✅ renamed to match DB
  role: { type: String, enum: ['admin', 'doctor'], default: 'doctor' },
  avatar: { type: String }
}, { timestamps: true });

// ✅ Compare password
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// ✅ Hash password
UserSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export default mongoose.model('User', UserSchema);
