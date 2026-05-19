const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getMenuByCaterer, addMenuItem, deleteMenuItem, getMyMenu } = require('../controllers/menuController');

router.get('/mine', auth, getMyMenu);         
router.get('/:catererId', getMenuByCaterer);
router.post('/', auth, addMenuItem);
router.delete('/:id', auth, deleteMenuItem);

module.exports = router;