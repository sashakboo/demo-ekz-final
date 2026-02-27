const db = require('../config/db');

// Создание таблицы помещений
const createTable = async () => {
  const query = `
    create sequence if not exists room_id_seq;
    create table if not exists rooms(
      id bigint default nextval('public.room_id_seq' :: regclass) primary key,
      name varchar(100) not null,
      type varchar(50) not null,
      description TEXT,
      price decimal(10, 2) not null
    );

  `;

  try {
    await db.query(query);
    console.log('Rooms table created successfully');

    const roomsCount = await db.query('SELECT COUNT(*) FROM rooms');
    if (parseInt(roomsCount.rows[0].count) === 0) {
      await seedRooms();
    }
  } catch (err) {
    console.error('Error creating rooms table:', err);
  }
};

const seedRooms = async () => {
  const rooms = [
    { name: 'Главный зал', type: 'Зал',  price: 50000, description: 'Просторный зал для больших мероприятий' },
    { name: 'Уютный ресторан', type: 'Ресторан', price: 35000, description: 'Атмосферный ресторан с живой музыкой' },
    { name: 'Летняя веранда', type: 'Летняя веранда', price: 25000, description: 'Открытая веранда с видом на сад' },
    { name: 'Закрытая веранда', type: 'Закрытая веранда',  price: 20000, description: 'Уютная веранда для камерных мероприятий' }
  ];

  for (const room of rooms) {
    await db.query(
      'INSERT INTO rooms (name, type, price, description) VALUES ($1, $2, $3, $4)',
      [room.name, room.type, room.price, room.description]
    );
  }
};

const findAll = async () => {
  const query = 'SELECT * FROM rooms ORDER BY id';
  const result = await db.query(query);
  return result.rows;
};

const findById = async (id) => {
  const query = 'SELECT * FROM rooms WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const findByType = async (type) => {
  const query = 'SELECT * FROM rooms WHERE type = $1';
  const result = await db.query(query, [type]);
  return result.rows;
};

module.exports = {
  createTable,
  findAll,
  findById,
  findByType
};
