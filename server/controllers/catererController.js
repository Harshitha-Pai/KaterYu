const Caterer = require('../models/Caterer');

exports.getAllCaterers = async (req, res) => {
  try {
    const caterers = await Caterer.find({ available: true })
      .populate('user', 'name email');
    res.json(caterers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCatererById = async (req, res) => {
  try {
    const caterer = await Caterer.findById(req.params.id)
      .populate('user', 'name email');
    if (!caterer) return res.status(404).json({ error: 'Not found' });
    res.json(caterer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.upsertProfile = async (req, res) => {
  try {
    const profile = await Caterer.findOneAndUpdate(
      { user: req.user.userId },
      { ...req.body, user: req.user.userId },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Caterer.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ error: 'No profile yet' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};