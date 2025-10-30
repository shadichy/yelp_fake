import { useState } from 'react';
import type { FC } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import api from '../api';
import type { AxiosError } from 'axios';

interface Props {
  onProfileCreated: () => void;
}

const CreatePatientProfile: FC<Props> = ({ onProfileCreated }) => {
  const [fullName, setFullName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/profile/patient',
        { full_name: fullName, date_of_birth: dateOfBirth, address, phone_number: phoneNumber },
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
        fullWidth
        label="Date of Birth"
        type="date"
        value={dateOfBirth}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Address"
        value={address}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Phone Number"
        value={phoneNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Create Profile
      </Button>
    </Box>
  );
};

export default CreatePatientProfile;
