import { useState } from 'react';
import type { FC } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import api from '../api';
import type { AxiosError } from 'axios';

interface Props {
  onProfileCreated: () => void;
}

const CreateTherapistProfile: FC<Props> = ({ onProfileCreated }) => {
  const [fullName, setFullName] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/profile/therapist',
        { full_name: fullName, license_number: licenseNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onProfileCreated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as AxiosError<{ detail: string }>;
        setError(axiosError.response?.data?.detail || axiosError.message);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        label="Full Name"
        value={fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="License Number"
        value={licenseNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicenseNumber(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Create Profile
      </Button>
    </Box>
  );
};

export default CreateTherapistProfile;
