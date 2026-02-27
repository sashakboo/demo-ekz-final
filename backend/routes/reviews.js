const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// POST api/reviews - Создать отзыв
router.post('/', [
  auth,
  body('booking_id').notEmpty().withMessage('Бронирование обязательно'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Рейтинг должен быть от 1 до 5'),
  body('comment').notEmpty().withMessage('Комментарий обязателен')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { booking_id, rating, comment } = req.body;
    
    // Проверяем, есть ли уже отзыв
    const existingReview = await Review.findByBookingId(booking_id);
    if (existingReview) {
      return res.status(400).json({ msg: 'Отзыв уже оставлен' });
    }

    // Проверяем, что бронирование завершено
    const booking = await Booking.findById(booking_id);
    if (!booking || booking.status !== 'Банкет завершен') {
      return res.status(400).json({ msg: 'Отзыв можно оставить только после завершения банкета' });
    }

    const newReview = await Review.createReview({
      user_id: req.user.userId,
      booking_id,
      rating,
      comment
    });

    res.json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET api/reviews/my - Мои отзывы
router.get('/my', auth, async (req, res) => {
  try {
    const reviews = await Review.findByUserId(req.user.userId);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
