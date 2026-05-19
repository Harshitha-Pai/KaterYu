const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  caterer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['starter', 'main', 'dessert', 'beverage'] },
  isVeg: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuItemSchema);