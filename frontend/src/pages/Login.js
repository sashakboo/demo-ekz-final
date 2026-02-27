import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, InputAdornment } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
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
      const response = await axios.post('/api/auth/login', formData);
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.msg) {
        setServerError(error.response.data.msg);
      } else {
        setServerError('Ошибка входа');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#DC143C', fontSize: '36px' }}>
        Вход
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
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
          Войти
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link to="/register" style={{ textDecoration: 'none', color: '#DAA520', fontWeight: 500 }}>
            Еще не зарегистрированы? Регистрация
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
