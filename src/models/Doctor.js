import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: String,
  clinic: String,
  phone: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Doctor', DoctorSchema);
