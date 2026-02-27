import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

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

const theme = createTheme({
  palette: {
    primary: {
      main: '#DC143C',
    },
    secondary: {
      main: '#DAA520',
    },
    gold: {
      main: '#DAA520',
    },
    roseGold: {
      main: '#FFDAB9',
    },
    cream: {
      main: '#FFFDD0',
    },
    green: {
      main: '#006400',
    },
  },
  typography: {
    fontFamily: "'Oswald', sans-serif",
    h1: {
      fontSize: '36px',
      color: '#DC143C',
    },
    h2: {
      fontSize: '24px',
      color: '#DAA520',
    },
    h3: {
      fontSize: '18px',
      color: '#DAA520',
    },
    h4: {
      fontSize: '24px',
      color: '#DAA520',
    },
    h5: {
      fontSize: '18px',
      color: '#DAA520',
    },
    h6: {
      fontSize: '18px',
      color: '#DAA520',
    },
    body1: {
      fontSize: '16px',
      color: '#000000',
    },
    body2: {
      fontSize: '14px',
      color: '#000000',
    },
    caption: {
      fontSize: '12px',
      color: '#006400',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#DAA520',
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  )
}

export default App;