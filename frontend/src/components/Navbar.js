import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Person as PersonIcon, Logout as LogoutIcon, AddBox as AddBoxIcon, AdminPanelSettings as AdminPanelSettingsIcon, Dashboard as DashboardIcon, Event as EventIcon } from '@mui/icons-material';

const Navbar = ({ token, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem button component="a" href="/dashboard" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
        <ListItemIcon sx={{ color: 'inherit' }}><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Личный кабинет" />
      </ListItem>
      {token ? (
        <>
          <ListItem button component="a" href="/booking" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <ListItemIcon sx={{ color: 'inherit' }}><AddBoxIcon /></ListItemIcon>
            <ListItemText primary="Новая заявка" />
          </ListItem>
          {user?.isAdmin && (
            <ListItem button component="a" href="/admin" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <ListItemIcon sx={{ color: 'inherit' }}><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary="Админ-панель" />
            </ListItem>
          )}
          <ListItem button onClick={onLogout} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component="a" href="/login" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <ListItemIcon sx={{ color: 'inherit' }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="Вход" />
          </ListItem>
          <ListItem button component="a" href="/register" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <ListItemIcon sx={{ color: 'inherit' }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="Регистрация" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: '#DAA520' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Банкетам.Нет
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {token ? (
            <>
              <Button color="inherit" href="/dashboard" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <DashboardIcon sx={{ mr: 0.5, fontSize: 20 }} /> Кабинет
              </Button>
              <Button color="inherit" href="/booking" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <AddBoxIcon sx={{ mr: 0.5, fontSize: 20 }} /> Заявка
              </Button>
              {user?.isAdmin && (
                <Button color="inherit" href="/admin" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <AdminPanelSettingsIcon sx={{ mr: 0.5, fontSize: 20 }} /> Админ
                </Button>
              )}
              <Button color="inherit" onClick={onLogout} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <LogoutIcon sx={{ mr: 0.5, fontSize: 20 }} /> Выйти
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" href="/login" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>Вход</Button>
              <Button color="inherit" href="/register" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>Регистрация</Button>
            </>
          )}
        </Box>
      </Toolbar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: '#DAA520' },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
