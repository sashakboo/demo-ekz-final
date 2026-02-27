import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';

import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Slider from './components/Slider';
import Dashboard from './pages/Dashboard';
import BookingForm from './pages/BookingForm';
import AdminPanel from './pages/AdminPanel';

import img1 from './assets/img/1.jpg';
import img2 from './assets/img/2.jpg';
import img3 from './assets/img/3.jpg';
import img4 from './assets/img/4.jpg';
const sliderImages = [img1, img2, img3, img4];

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    if (token){
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = (n) => {
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ px: 0}}>
        <Navbar token={token} user={user} onLogout={handleLogout} />
        {sliderImages.length > 0 && <Slider images={sliderImages}/>}
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />}/>
          <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}/>
          <Route path="/register" element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />}/>
          <Route path="/dashboard" element={token ? <Dashboard token={token} user={user} /> : <Navigate to="/login"/>}/>
          <Route path="/booking" element={token ? <BookingForm token={token} user={user} />: <Navigate to="/login"/>} />
          <Route path="/admin" element={token && user?.isAdmin ? <AdminPanel token={token} user={user} />: <Navigate to="/login"/>} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App;