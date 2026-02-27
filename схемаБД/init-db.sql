create database if not exits "demoekz-final";

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

create sequence if not exists room_id_seq;
create table if not exists rooms(
  id bigint default nextval('public.room_id_seq' :: regclass) primary key,
  name varchar(100) not null,
  type varchar(50) not null,
  description TEXT,
  price decimal(10, 2) not null
);

create sequence if not exists booking_id_seq;
create table if not exists bookings(
  id bigint default nextval('public.booking_id_seq' :: regclass) primary key,
  user_id bigint not null references users(id),
  room_id bigint not null references rooms(id),
  event_date date not null,
  payment_method varchar(50) not null,
  status varchar(50) default 'Новая',
  created_at timestamp default current_timestamp
);

create sequence if not exists review_id_seq;
create table if not exists bookings(
  id bigint default nextval('public.review_id_seq' :: regclass) primary key,
  user_id bigint not null references users(id),
  booking_id bigint not null references bookings(id),
  rating int check (rating >=1 and rating <= 5),
  comment TEXT
);