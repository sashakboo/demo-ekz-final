import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Alert } from '@mui/material';
import { Event as EventIcon, Payment as PaymentIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = ({ token, user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({ open: false, bookingId: null, bookingName: '' });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my', {
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

  const handleOpenReview = (booking) => {
    setReviewDialog({ open: true, bookingId: booking.id, bookingName: booking.room_name });
    setReviewData({ rating: 5, comment: '' });
  };

  const handleSubmitReview = async () => {
    try {
      await axios.post('/api/reviews', {
        booking_id: reviewDialog.bookingId,
        rating: reviewData.rating,
        comment: reviewData.comment
      }, {
        //headers: { Authorization: `Bearer ${token}` }
        headers: { Authorization: `${token}` }
      });
      setMessage({ type: 'success', text: 'Отзыв успешно оставлен!' });
      setReviewDialog({ open: false, bookingId: null, bookingName: '' });
      fetchBookings();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Ошибка отправки отзыва' });
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

  if (loading) {
    return <Typography sx={{ mt: 4 }}>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h4" gutterBottom>
        {user?.fullname}
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Button variant="contained" href="/booking" startIcon={<EventIcon />}>
          Создать новую заявку
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        История заявок
      </Typography>

      {bookings.length === 0 ? (
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          У вас пока нет заявок
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {booking.room_name}
                    </Typography>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {booking.room_type}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2">
                      {new Date(booking.event_date).toLocaleDateString('ru-RU')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PaymentIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2">
                      {booking.payment_method === 'card' ? 'Банковская карта' : 'Наличные'}
                    </Typography>
                  </Box>
                  {booking.status === 'Банкет завершен' && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenReview(booking)}
                      startIcon={<CheckCircleIcon />}
                      fullWidth
                    >
                      Оставить отзыв
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Диалог отзыва */}
      <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, bookingId: null, bookingName: '' })}>
        <DialogTitle>Отзыв о мероприятии</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {reviewDialog.bookingName}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Оценка</Typography>
            <Rating
              value={reviewData.rating}
              onChange={(e, newValue) => setReviewData({ ...reviewData, rating: newValue })}
            />
          </Box>
          <TextField
            fullWidth
            label="Комментарий"
            multiline
            rows={4}
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ open: false, bookingId: null, bookingName: '' })}>
            Отмена
          </Button>
          <Button onClick={handleSubmitReview} variant="contained" disabled={!reviewData.comment.trim()}>
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
