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
      <ListItem button component="a" href="/dashboard">
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Личный кабинет" />
      </ListItem>
      {token ? (
        <>
          <ListItem button component="a" href="/booking">
            <ListItemIcon><AddBoxIcon /></ListItemIcon>
            <ListItemText primary="Новая заявка" />
          </ListItem>
          {user?.isAdmin && (
            <ListItem button component="a" href="/admin">
              <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary="Админ-панель" />
            </ListItem>
          )}
          <ListItem button onClick={onLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component="a" href="/login">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Вход" />
          </ListItem>
          <ListItem button component="a" href="/register">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Регистрация" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Банкетам.Нет
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {token ? (
            <>
              <Button color="inherit" href="/dashboard">
                <DashboardIcon sx={{ mr: 0.5, fontSize: 20 }} /> Кабинет
              </Button>
              <Button color="inherit" href="/booking">
                <AddBoxIcon sx={{ mr: 0.5, fontSize: 20 }} /> Заявка
              </Button>
              {user?.isAdmin && (
                <Button color="inherit" href="/admin">
                  <AdminPanelSettingsIcon sx={{ mr: 0.5, fontSize: 20 }} /> Админ
                </Button>
              )}
              <Button color="inherit" onClick={onLogout}>
                <LogoutIcon sx={{ mr: 0.5, fontSize: 20 }} /> Выйти
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" href="/login">Вход</Button>
              <Button color="inherit" href="/register">Регистрация</Button>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
