const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAllCaterers, getCatererById, upsertProfile, getMyProfile } = require('../controllers/catererController');

router.get('/my-profile', auth, getMyProfile); 
router.get('/', getAllCaterers);
router.get('/:id', getCatererById);
router.put('/profile', auth, upsertProfile);

module.exports = router;