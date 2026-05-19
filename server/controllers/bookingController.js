const Booking = require('../models/Booking');
const Caterer = require('../models/Caterer');

// Customer creates a booking request
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      customer: req.user.userId,
      status: 'pending'
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Customer sees their own bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.userId })
      .populate('caterer', 'name email')
      .sort({ cateredAt: -1});
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Caterer sees bookings made to them
exports.getIncomingBookings = async (req, res) => {
  try {
    const catererProfile = await Caterer.findOne({ user: req.user.userId });
    if (!catererProfile) return res.json([]);

    const bookings = await Booking.find({ caterer: catererProfile._id })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Caterer accepts or declines a booking
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'declined', 'completed'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, caterer: req.user.userId },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};