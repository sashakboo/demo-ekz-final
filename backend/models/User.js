const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Создание таблицы пользователей
const createTable = async () => {
  const query = `
    create sequence if not exists user_id_seq;
    create table if not exists users(
      id bigint default nextval('public.user_id_seq' :: regclass) primary key,
      login varchar(50) unique not null,
      password varchar(255) not null,
      fullname varchar(255) not null,
      phone varchar(20) not null,
      email varchar(100) not null,
      is_admin boolean default false
    );
  `;

  try {
    await db.query(query);
    console.log('Users table created successfully');

    // Создаем администратора если нет
    const adminExists = await findByLogin('Admin26');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Demo20', '10');
      await createUser({
        login: 'Admin26',
        password: hashedPassword,
        fullname: 'Администратор',
        phone: '+7(000)-000-00-00',
        email: 'admin@banquet.net',
        is_admin: true
      });
      console.log('Admin user created successfully');
    }
  } catch (err) {
    console.error('Error creating users table:', err);
  }
};

const createUser = async ({ login, password, fullname, phone, email, is_admin = false }) => {
  const query = `
    INSERT INTO users (login, password, fullname, phone, email, is_admin) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const values = [login, password, fullname, phone, email, is_admin];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findByLogin = async (login) => {
  const query = 'SELECT * FROM users WHERE login = $1';
  const result = await db.query(query, [login]);
  return result.rows[0];
};

const findById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createTable,
  createUser,
  findByLogin,
  findById
};
