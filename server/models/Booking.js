const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  caterer:  { type: mongoose.Schema.Types.ObjectId, ref: 'Caterer', required: true }, // ✅ ref Caterer not User
  eventDate: { type: Date,   required: true },
  eventType: { type: String, required: true },
  guests:    { type: Number, required: true },
  menuItems: [String],
  status:    { type: String, enum: ['pending','confirmed','declined','completed'], default: 'pending' },
  message:   { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);