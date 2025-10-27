
import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../api';

interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  office_address: string;
  phone_number: string;
  website: string;
  years_of_experience: number;
  availability: string;
  profile_picture_url: string;
}

const TherapistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await api.get(`/profile/therapist/${id}`);
        setTherapist(response.data);
      } catch (err) {
        setError('Failed to fetch therapist data.');
      }
      setLoading(false);
    };

    fetchTherapist();
  }, [id]);

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
            <Typography>Website: <a href={therapist.website} target="_blank" rel="noopener noreferrer">{therapist.website}</a></Typography>
          )}
          <Typography>Availability: {therapist.availability}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TherapistProfile;
