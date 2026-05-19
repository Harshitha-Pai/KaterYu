const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caterer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventDate: { type: Date, required: true },
  eventType: { type: String },
  guests:    { type: Number },
  menuItems: [String],
  status:    { type: String, enum: ['pending','confirmed','declined','completed'], default: 'pending' },
  message:   { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);