const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// GET api/bookings/my - Получить мои бронирования
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.findByUserId(req.user.userId);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST api/bookings - Создать новое бронирование
router.post('/', [
  auth,
  body('room_id').notEmpty().withMessage('Помещение обязательно'),
  body('event_date').notEmpty().withMessage('Дата обязательна'),
  body('payment_method').notEmpty().withMessage('Способ оплаты обязателен')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { room_id, event_date, payment_method } = req.body;
    
    const newBooking = await Booking.createBooking({
      user_id: req.user.userId,
      room_id,
      event_date,
      payment_method
    });

    res.json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
