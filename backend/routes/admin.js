const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

//Все бронирования 
router.get('/bookings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.is_admin) {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Обновить статус 
router.put('/bookings/:id/status', [
  auth,
  body('status').isIn(['Новая', 'Банкет назначен', 'Банкет завершен']).withMessage('Неверный статус')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.userId);
    if (!user || !user.is_admin) {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    const { status } = req.body;
    const updatedBooking = await Booking.updateStatus(req.params.id, status);
    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
