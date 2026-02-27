const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

// Проверка подключения к БД
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к БД', err);
  } else {
    console.log('Подключение к БД выполнено');
  }
});

// Инициализация БД
async function initializeTables() {
  try {
    const User = require('./models/User');
    const Room = require('./models/Room');
    const Booking = require('./models/Booking');
    const Review = require('./models/Review');

    await User.createTable();
    await Room.createTable();
    await Booking.createTable();
    await Review.createTable();

    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

initializeTables();

const app = express();

app.use(express.json());
app.use(cors());

// Подключение маршрутов
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
