const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createBooking, getMyBookings, getIncomingBookings, updateStatus, deleteBooking } = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/mine', auth, getMyBookings);
router.get('/incoming', auth, getIncomingBookings);
router.patch('/:id/status', auth, updateStatus);
router.delete('/:id',auth, deleteBooking);

module.exports = router;