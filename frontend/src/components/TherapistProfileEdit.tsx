import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';
import type { Therapist } from '../types/therapist';
import { TextField, Button, Box, Typography, IconButton, Alert, Avatar, Modal } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import LocationPicker from './LocationPicker';

const TherapistProfileEdit: FC = () => {
  const [profile, setProfile] = useState<Therapist | null>(null);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await api.get<Therapist>(`/profile/therapist`);
          setProfile(response.data);
          if (!response.data.office_address) {
            navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                if (data.display_name) {
                  setProfile((prevProfile) => ({
                    ...prevProfile!,
                    office_address: data.display_name,
                    latitude,
                    longitude,
                  }));
                }
              } catch (error) {
                console.error('Error getting address from coordinates:', error);
              }
            });
          }
        } catch (error) {
          console.error('Error fetching therapist profile:', error);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (profile) {
      try {
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          await api.post('/profile/therapist/picture', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        await api.put('/profile/therapist', profile);
        setAlert({ severity: 'success', message: 'Profile updated successfully!' });
      } catch (error) {
        console.error('Error updating therapist profile:', error);
        setAlert({ severity: 'error', message: 'Error updating profile' });
      }
    }
  };

  const handleMapClick = () => {
    setIsModalOpen(true);
  };

  const handleLocationSelect = (lat: number, lon: number, address: string) => {
    if (profile) {
      setProfile({ ...profile, office_address: address, latitude: lat, longitude: lon });
    }
    setIsModalOpen(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit Therapist Profile
      </Typography>
      {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={profile.profile_picture_url} sx={{ width: 100, height: 100, mr: 2 }} />
        <Button variant="contained" component="label">
          Upload Picture
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Box>
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
        label="Specialization"
        name="specialization"
        value={profile.specialization}
        onChange={handleChange}
        margin="normal"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <TextField
          fullWidth
          label="Office Address"
          name="office_address"
          value={profile.office_address}
          onChange={handleChange}
          margin="normal"
        />
        <IconButton onClick={handleMapClick} color="primary">
          <MapIcon />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        label="Phone Number"
        name="phone_number"
        value={profile.phone_number}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Website"
        name="website"
        value={profile.website}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Years of Experience"
        name="years_of_experience"
        type="number"
        value={profile.years_of_experience}
        onChange={handleChange}
        margin="normal"
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Save Changes
      </Button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </Box>
      </Modal>
    </Box>
  );
};

export default TherapistProfileEdit;