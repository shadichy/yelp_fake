import { useState } from 'react';
import type { FC } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import api from '../api';
import { UserType } from '../schemas/enums';
import type { AxiosError } from 'axios';

const Register: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userType, setUserType] = useState<UserType>(UserType.PATIENT);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/users/', {
        email,
        password,
        user_type: userType,
      });

      if (response.status !== 200) {
        throw new Error(response.data.detail || 'Something went wrong');
      }

      setSuccess('User created successfully. Please check your email to verify your account.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as AxiosError<{ detail: string }>;
        setError(axiosError.response?.data?.detail || axiosError.message);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="user-type"
              value={userType}
              label="User Type"
              onChange={(e: SelectChangeEvent<UserType>) => setUserType(e.target.value as UserType)}
            >
              <MenuItem value={UserType.PATIENT}>Patient</MenuItem>
              <MenuItem value={UserType.THERAPIST}>Therapist</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;