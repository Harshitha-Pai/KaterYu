const Menu = require('../models/Menu');

exports.getMenuByCaterer = async (req, res) => {
  try {
    const items = await Menu.find({ caterer: req.params.catererId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ also expose logged-in caterer's own menu
exports.getMyMenu = async (req, res) => {
  try {
    const items = await Menu.find({ caterer: req.user.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const item = await Menu.create({ ...req.body, caterer: req.user.userId });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await Menu.findOneAndDelete({ _id: req.params.id, caterer: req.user.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};