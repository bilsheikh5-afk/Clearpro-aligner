import Case from '../models/Case.js';

// ✅ Approve a case
export const approveCase = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ success: true, status: 'Approved', case: updated });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Reject a case
export const rejectCase = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ success: true, status: 'Rejected', case: updated });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
