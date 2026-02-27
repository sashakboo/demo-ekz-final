const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

// GET api/rooms - Получить все помещения
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET api/rooms/:id - Получить помещение по ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Помещение не найдено' });
    }
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET api/rooms/type/:type - Получить помещения по типу
router.get('/type/:type', async (req, res) => {
  try {
    const rooms = await Room.findByType(req.params.type);
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
