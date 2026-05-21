const Booking = require('../models/Booking');
const Caterer = require('../models/Caterer');

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

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.userId })
      .populate({
        path: 'caterer',           // Caterer doc
        populate: {
          path: 'user',            // then pull User name/email from inside it
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    // flatten so frontend gets booking.caterer.name directly
    const result = bookings.map(b => ({
      ...b.toObject(),
      caterer: { _id: b.caterer?._id, name: b.caterer?.user?.name, email: b.caterer?.user?.email }
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'declined', 'completed'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const catererProfile = await Caterer.findOne({ user: req.user.userId });
    if (!catererProfile) return res.status(404).json({ error: 'Caterer profile not found' });

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, caterer: catererProfile._id },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      customer: req.user.userId,
      status: 'pending'
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found or cannot be deleted' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};