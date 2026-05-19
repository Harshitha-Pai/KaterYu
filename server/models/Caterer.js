const mongoose = require('mongoose');

const catererSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  cuisine: [String],               // e.g. ['Indian', 'Italian']
  serviceArea: { type: String },
  pricePerPlate: { type: Number },
  phone: { type: String },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Caterer', catererSchema);