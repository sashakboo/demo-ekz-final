import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const BookingForm = ({ token, user }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room_id: '',
    event_date: null,
    payment_method: ''
  });
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerError('');
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, event_date: date });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setServerError('');
    setSuccess(false);

    if (!formData.room_id || !formData.event_date || !formData.payment_method) {
      setServerError('Заполните все поля');
      return;
    }

    try {
      const formattedDate = formData.event_date.toISOString().split('T')[0];
      await axios.post('/api/bookings', {
        room_id: formData.room_id,
        event_date: formattedDate,
        payment_method: formData.payment_method
      }, {
        //headers: { Authorization: `Bearer ${token}` }
        headers: { Authorization: `${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.msg) {
        setServerError(error.response.data.msg);
      } else {
        setServerError('Ошибка создания заявки');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#DC143C', fontSize: '36px' }}>
        Оформление заявки
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>Заявка создана!</Alert>}
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
      {errors.map((error, index) => (
        <Alert key={index} severity="error" sx={{ mb: 1 }}>{error.msg}</Alert>
      ))}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <FormControl fullWidth required error={!!serverError && !formData.room_id}>
          <InputLabel id="room-label">Помещение</InputLabel>
          <Select
            labelId="room-label"
            name="room_id"
            value={formData.room_id}
            label="Помещение"
            onChange={handleChange}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </Select>
          {formData.room_id && rooms.find(r => r.id === formData.room_id) && (
            <FormHelperText>
              {rooms.find(r => r.id === formData.room_id).price} ₽ | 
              {rooms.find(r => r.id === formData.room_id).description}
            </FormHelperText>
          )}
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Дата начала банкета"
            value={formData.event_date}
            onChange={handleDateChange}
            minDate={new Date()}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                sx={{ mt: 3 }}
                helperText="Выберите дату в формате ДД.ММ.ГГГГ"
              />
            )}
          />
        </LocalizationProvider>

        <FormControl fullWidth required sx={{ mt: 3 }}>
          <InputLabel id="payment-label">Способ оплаты</InputLabel>
          <Select
            labelId="payment-label"
            name="payment_method"
            value={formData.payment_method}
            label="Способ оплаты"
            onChange={handleChange}
          >
            <MenuItem value="card">Банковская карта</MenuItem>
            <MenuItem value="cash">Наличные</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            Забронировать
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard')}
            fullWidth
          >
            Отмена
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingForm;
