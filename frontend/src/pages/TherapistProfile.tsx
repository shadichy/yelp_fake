
import { useState, useEffect, type ChangeEvent } from 'react';
import type { FC } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Rating,
  Box,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import type { RootState } from '../app/store';
import api from '../api';
import type { Therapist } from '../types/therapist';
import type { Availability } from '../types/availability';
import type { Review } from '../types/review';
import { UserType } from '../schemas/enums';
import type { DecodedToken } from '../types/jwt';

const TherapistProfile: FC = () => {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<DecodedToken | null>(null);

  const id = sessionStorage.getItem('selectedTherapistId') || '';

  useEffect(() => {
    if (token) {
      setUser(jwtDecode<DecodedToken>(token));
    }
  }, [token]);

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await api.get<Therapist>(`/profile/therapist/${id}`);
        setTherapist(response.data);
        const availabilityResponse = await api.get<Availability[]>(`/availability/?therapist_id=${id}`);
        setAvailabilities(availabilityResponse.data);
        const reviewsResponse = await api.get<Review[]>(`/reviews/${id}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch therapist data.');
      }
      setLoading(false);
    };

    fetchTherapist();
  }, [id]);

  const handleBookAppointment = async (availability: Availability) => {
    try {
      await api.post('/appointments/', {
        therapist_id: therapist?.id,
        start_time: availability.start_time,
        end_time: availability.end_time,
      });
      alert('Appointment booked successfully!');
    } catch (err) {
      console.log(err);
      alert('Failed to book appointment.');
    }
  };

  const handleAddReview = async () => {
    if (rating === null) {
      alert('Please provide a rating.');
      return;
    }
    try {
      const response = await api.post<Review>('/reviews/', { therapist_id: therapist?.id, rating, comment });
      setReviews([...reviews, response.data]);
      setRating(0);
      setComment('');
    } catch (err) {
      console.log(err);
      alert('Failed to submit review.');
    }
  };

  const handleMessageTherapist = () => {
    if (therapist?.id) {
      sessionStorage.setItem('messagingTargetId', String(therapist.id));
      navigate('/messaging');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!therapist) {
    return <Alert severity="info">Therapist not found.</Alert>;
  }

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h4">{therapist.full_name}</Typography>
          <Typography variant="h6">{therapist.specialization}</Typography>
          <Typography>Years of Experience: {therapist.years_of_experience}</Typography>
          <Typography>Address: {therapist.office_address}</Typography>
          <Typography>Phone: {therapist.phone_number}</Typography>
          {therapist.website && (
            <Typography>
              Website: <a href={therapist.website} target="_blank" rel="noopener noreferrer">{therapist.website}</a>
            </Typography>
          )}
        </CardContent>
      </Card>

      {user?.user_type === UserType.PATIENT && (
        <Button
          variant="contained"
          sx={{ mt: 2, mr: 1 }}
          onClick={handleMessageTherapist}
        >
          Message Therapist
        </Button>
      )}

      {user?.user_type === UserType.PATIENT && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5">Book an Appointment</Typography>
            {availabilities.length > 0 ? (
              availabilities.map((avail) => (
                <Button
                  key={avail.id}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                  onClick={() => handleBookAppointment(avail)}
                >
                  {new Date(avail.start_time).toLocaleString()} - {new Date(avail.end_time).toLocaleString()}
                </Button>
              ))
            ) : (
              <Typography>No availabilities found.</Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h5">Reviews</Typography>
          {reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 1 }}>
              <CardContent>
                <Rating value={review.rating} readOnly />
                <Typography>{review.comment}</Typography>
              </CardContent>
            </Card>
          ))}

          {user?.user_type === UserType.PATIENT && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Leave a Review</Typography>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(_event: ChangeEvent<unknown>, newValue: number | null) => {
                  setRating(newValue);
                }}
              />
              <TextField
                label="Comment"
                multiline
                rows={4}
                value={comment}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mt: 1, mb: 1 }}
              />
              <Button variant="contained" onClick={handleAddReview}>Submit Review</Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TherapistProfile;
