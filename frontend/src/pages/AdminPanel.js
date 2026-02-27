import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, TextField, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FilterList, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const AdminPanel = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [page, setPage] = useState(1);
  const [statusDialog, setStatusDialog] = useState({ open: false, bookingId: null, bookingName: '', currentStatus: '' });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings', {
        //headers: { Authorization: `Bearer ${token}` }
        headers: { Authorization: `${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage({ type: 'error', text: 'Ошибка загрузки данных' });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleOpenStatusDialog = (booking, newStatus) => {
    setStatusDialog({ 
      open: true, 
      bookingId: booking.id, 
      bookingName: booking.room_name,
      currentStatus: booking.status,
      newStatus: newStatus
    });
  };

  const confirmStatusChange = async () => {
    try {
      await axios.put(
        `/api/admin/bookings/${statusDialog.bookingId}/status`,
        { status: statusDialog.newStatus },
        //{ headers: { Authorization: `Bearer ${token}` } }
        { headers: { Authorization: `${token}` } }
      );
      setMessage({ type: 'success', text: 'Статус обновлен' });
      setStatusDialog({ open: false, bookingId: null, bookingName: '', currentStatus: '', newStatus: '' });
      fetchBookings();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка обновления статуса' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Новая':
        return 'info';
      case 'Банкет назначен':
        return 'warning';
      case 'Банкет завершен':
        return 'success';
      default:
        return 'default';
    }
  };

  // Фильтрация
  let filteredBookings = filter === 'all' ? bookings : bookings.filter(item => item.status === filter);

  // Сортировка
  filteredBookings.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'event_date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель администратора
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Фильтр по статусу"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          SelectProps={{ native: true }}
          sx={{ minWidth: 200 }}
          InputProps={{ startAdornment: <FilterList sx={{ mr: 1, color: 'action.active' }} /> }}
        >
          <option value="all">Все заявки</option>
          <option value="Новая">Новые</option>
          <option value="Банкет назначен">Банкет назначен</option>
          <option value="Банкет завершен">Банкет завершен</option>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell onClick={() => handleSort('user_name')} style={{ cursor: 'pointer' }}>
                Клиент {sortField === 'user_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Помещение</TableCell>
              <TableCell onClick={() => handleSort('event_date')} style={{ cursor: 'pointer' }}>
                Дата {sortField === 'event_date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Оплата</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>
                  <Typography variant="body2">{booking.user_name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {booking.user_email} | {booking.user_phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{booking.room_name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {booking.room_type}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(booking.event_date).toLocaleDateString('ru-RU')}</TableCell>
                <TableCell>
                  {booking.payment_method === 'card' ? 'Карта' : 'Наличные'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {booking.status === 'Новая' && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleOpenStatusDialog(booking, 'Банкет назначен')}
                        sx={{ minWidth: 'auto', mr: 1 }}
                      >
                        <CheckIcon />
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleOpenStatusDialog(booking, 'Банкет завершен')}
                        sx={{ minWidth: 'auto' }}
                      >
                        <CloseIcon />
                      </Button>
                    </>
                  )}
                  {booking.status === 'Банкет назначен' && (
                    <Button
                      size="small"
                      color="success"
                      onClick={() => handleOpenStatusDialog(booking, 'Банкет завершен')}
                    >
                      Завершить
                    </Button>
                  )}
                  {booking.status === 'Банкет завершен' && (
                    <Chip label="✓" size="small" color="success" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Пагинация */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Назад
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={page === p ? 'contained' : 'outlined'}
              onClick={() => setPage(p)}
              sx={{ minWidth: 40 }}
            >
              {p}
            </Button>
          ))}
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Вперед
          </Button>
        </Box>
      )}

      <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
        Показано {paginatedBookings.length} из {filteredBookings.length} заявок
      </Typography>

      {/* Диалог подтверждения смены статуса */}
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, bookingId: null, bookingName: '', currentStatus: '', newStatus: '' })}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <Typography>
            Изменить статус заявки <b>{statusDialog.bookingName}</b> на <b>{statusDialog.newStatus}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, bookingId: null, bookingName: '', currentStatus: '', newStatus: '' })}>
            Отмена
          </Button>
          <Button onClick={confirmStatusChange} variant="contained" color="primary">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
