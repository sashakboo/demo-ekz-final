const db = require('../config/db');

// Создание таблицы отзывов
const createTable = async () => {
  const query = `
    create sequence if not exists review_id_seq;
    create table if not exists bookings(
      id bigint default nextval('public.review_id_seq' :: regclass) primary key,
      user_id bigint not null references users(id),
      booking_id bigint not null references bookings(id),
      rating int check (rating >=1 and rating <= 5),
      comment TEXT
    );
  `;

  try {
    await db.query(query);
    console.log('Reviews table created successfully');
  } catch (err) {
    console.error('Error creating reviews table:', err);
  }
};

const createReview = async ({ user_id, booking_id, rating, comment }) => {
  const query = `
    INSERT INTO reviews (user_id, booking_id, rating, comment) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const values = [user_id, booking_id, rating, comment];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findByUserId = async (user_id) => {
  const query = `
    SELECT r.*, v.name as room_name
    FROM reviews r 
    JOIN bookings b ON r.booking_id = b.id
    JOIN rooms v ON b.room_id = v.id
    WHERE r.user_id = $1 
    ORDER BY r.id DESC
  `;
  const result = await db.query(query, [user_id]);
  return result.rows;
};

const findByBookingId = async (booking_id) => {
  const query = 'SELECT * FROM reviews WHERE booking_id = $1';
  const result = await db.query(query, [booking_id]);
  return result.rows[0];
};

module.exports = {
  createTable,
  createReview,
  findByUserId,
  findByBookingId
};
