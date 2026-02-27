import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, InputAdornment } from '@mui/material';
import { Person, Lock, Email, Phone, Badge } from '@mui/icons-material';
import axios from 'axios';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    fullname: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setServerError('');

    try {
      const response = await axios.post('/api/auth/register', formData);
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.msg) {
        setServerError(error.response.data.msg);
      } else {
        setServerError('Ошибка регистрации');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#DC143C', fontSize: '36px' }}>
        Регистрация
      </Typography>

      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
      {errors.map((error, index) => (
        <Alert key={index} severity="error" sx={{ mb: 1 }}>{error.msg}</Alert>
      ))}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Логин"
          name="login"
          value={formData.login}
          onChange={handleChange}
          margin="normal"
          required
          helperText="Латинские буквы и цифры, мин. 6 символов"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
          helperText="Минимум 8 символов"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="ФИО"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          margin="normal"
          required
          helperText="Только кириллица и пробелы"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Badge />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Телефон"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="+7(XXX)-XXX-XX-XX"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2 }}
        >
          Зарегистрироваться
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: '#DAA520', fontWeight: 500 }}>
            Уже есть аккаунт? Войти
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
