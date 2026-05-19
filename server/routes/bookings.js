const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createBooking, getMyBookings, getIncomingBookings, updateStatus } = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/mine', auth, getMyBookings);
router.get('/incoming', auth, getIncomingBookings);
router.patch('/:id/status', auth, updateStatus);

module.exports = router;