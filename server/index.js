const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kateryu.vercel.app'  // ← replace with your actual Vercel URL
  ],
  credentials: true
}));
app.use(express.json());


// ✅ correct paths — files live in routes/ subfolder
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/caterers', require('./routes/caterers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/menus',    require('./routes/menus'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB error:', err));