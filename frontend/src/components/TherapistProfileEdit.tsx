import { useState, type FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../api';
import type { TherapistProfile } from '../types/profile';
import { UserType } from '../schemas/enums';

const TherapistProfileEdit: FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && user && user.user_type === UserType.THERAPIST) {
        try {
          const response = await api.get<TherapistProfile>(`/profile/therapist/${user.id}`);
          setProfile(response.data);
        } catch (err) {
          setError('Failed to fetch profile.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Not authenticated or not a therapist.');
      }
    };
    fetchProfile();
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...(prevProfile as TherapistProfile),
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put(`/profile/therapist/${user.id}`, profile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="sm">
        <Alert severity="info" sx={{ mt: 4 }}>
          No therapist profile found. Please create one.
        </Alert>
        {/* Optionally add a form to create a new profile here */}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Therapist Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="full_name"
          label="Full Name"
          name="full_name"
          autoComplete="name"
          value={profile.full_name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="specialization"
          label="Specialization"
          name="specialization"
          autoComplete="specialization"
          value={profile.specialization || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="license_number"
          label="License Number"
          name="license_number"
          autoComplete="license-number"
          value={profile.license_number || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="years_of_experience"
          label="Years of Experience"
          name="years_of_experience"
          type="number"
          value={profile.years_of_experience || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="bio"
          label="Bio"
          name="bio"
          multiline
          rows={4}
          value={profile.bio || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="office_address"
          label="Office Address"
          name="office_address"
          autoComplete="address-line1"
          value={profile.office_address || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="phone_number"
          label="Phone Number"
          name="phone_number"
          autoComplete="tel"
          value={profile.phone_number || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="website"
          label="Website"
          name="website"
          autoComplete="url"
          value={profile.website || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="latitude"
          label="Latitude"
          name="latitude"
          type="number"
          value={profile.latitude || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="longitude"
          label="Longitude"
          name="longitude"
          type="number"
          value={profile.longitude || ''}
          onChange={handleChange}
        />
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          Save Profile
        </Button>
      </Box>
    </Container>
  );
};

export default TherapistProfileEdit;
