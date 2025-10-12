import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  type: { type: String, enum: ['stl', 'photo', 'xray'], required: true },
  originalName: String,
  path: String,
  url: String,
  size: Number,
  mimeType: String
}, { timestamps: true, _id: false });

const CaseSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: {
    name: { type: String, required: true },
    dateOfBirth: Date,
    gender: String,
    email: String,
    phone: String
  },
  details: {
    caseType: String,
    complexity: String,
    treatmentDurationMonths: Number,
    previousTreatment: String,
    notes: String
  },
  status: { type: String, enum: ['pending', 'in_review', 'approved', 'rejected'], default: 'pending' },
  files: [FileSchema]
}, { timestamps: true });

export default mongoose.model('Case', CaseSchema);
