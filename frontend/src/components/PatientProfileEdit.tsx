import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';
import type { PatientProfile } from '../types/profile';
import { TextField, Button, Box, Typography } from '@mui/material';

const PatientProfileEdit: FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await api.get<PatientProfile>(`/profile/patient`);
          setProfile(response.data);
        } catch (error) {
          console.error('Error fetching patient profile:', error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (profile) {
      try {
        await api.put('/profile/patient', profile);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating patient profile:', error);
      }
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit Patient Profile
      </Typography>
      <TextField
        fullWidth
        label="Full Name"
        name="full_name"
        value={profile.full_name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Date of Birth"
        name="date_of_birth"
        type="date"
        value={profile.date_of_birth}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={profile.address}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone Number"
        name="phone_number"
        value={profile.phone_number}
        onChange={handleChange}
        margin="normal"
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default PatientProfileEdit;