const db = require('../config/db');

// Создание таблицы бронирований
const createTable = async () => {
  const query = `
    create sequence if not exists booking_id_seq;
    create table if not exists bookings(
      id bigint default nextval('public.booking_id_seq' :: regclass) primary key,
      user_id bigint not null references users(id),
      room_id bigint not null references rooms(id),
      event_date date not null,
      payment_method varchar(50) not null,
      status varchar(50) default 'Новая'
    );
  `;

  try {
    await db.query(query);
    console.log('Bookings table created successfully');
  } catch (err) {
    console.error('Error creating bookings table:', err);
  }
};

const createBooking = async ({ user_id, room_id, event_date, payment_method }) => {
  const query = `
    INSERT INTO bookings (user_id, room_id, event_date, payment_method, status)
    VALUES ($1, $2, $3, $4, 'Новая')
    RETURNING *
  `;
  const values = [user_id, room_id, event_date, payment_method];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findByUserId = async (user_id) => {
  const query = `
    SELECT b.*, r.name as room_name, r.type as room_type
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
  `;
  const result = await db.query(query, [user_id]);
  return result.rows;
};

const findById = async (id) => {
  const query = `
    SELECT b.*, r.name as room_name, r.type as room_type, u.fullname as user_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.id = $1
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const findAll = async () => {
  const query = `
    SELECT b.*, r.name as room_name, r.type as room_type, u.fullname as user_name, u.email as user_email, u.phone as user_phone
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

const updateStatus = async (id, status) => {
  const query = 'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *';
  const result = await db.query(query, [status, id]);
  return result.rows[0];
};

module.exports = {
  createTable,
  createBooking,
  findByUserId,
  findById,
  findAll,
  updateStatus
};
