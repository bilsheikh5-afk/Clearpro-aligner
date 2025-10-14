import Case from '../models/Case.js';

// ✅ Approve Case
export const approveCase = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },  // ✅ lowercase (matches schema)
      { new: true }
    ).populate('doctor', 'name email');

    if (!updated) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ success: true, case: updated });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Reject Case
export const rejectCase = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' }, // ✅ lowercase
      { new: true }
    ).populate('doctor', 'name email');

    if (!updated) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ success: true, case: updated });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get all cases for admin dashboard
export const getCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('doctor', 'name email role')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
};

// ✅ Get all doctors (if needed for stats)
import User from '../models/User.js';
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email role');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};
