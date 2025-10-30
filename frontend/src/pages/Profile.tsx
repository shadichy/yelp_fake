import { useState, useEffect } from 'react';
import React from 'react';
import { Container, Typography, Box, Alert, CircularProgress, Button } from '@mui/material';
import CreatePatientProfile from '../components/CreatePatientProfile';
import CreateTherapistProfile from '../components/CreateTherapistProfile';
import api from '../api';
import { UserType } from '../schemas/enums';
import type { Profile as TypeProfile, ProfileResponse } from '../types/profile';
import type { User } from '../types/user';
import type { AxiosError } from 'axios';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<TypeProfile | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await api.get<ProfileResponse>('/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        const { data: user } = await api.get<User>('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserType(user.user_type);
        setShowCreateForm(true);
        setProfile(null);
        return;
      }

      setProfile(response.data.profile);
      setUserType(response.data.user_type);
      setShowCreateForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as AxiosError<{ detail: string }>;
        setError(axiosError.response?.data?.detail || axiosError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileCreated = () => {
    fetchProfile();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        {showCreateForm && (
          <Box>
            <Typography variant="h6">Create your profile</Typography>
            {userType === UserType.PATIENT && <CreatePatientProfile onProfileCreated={handleProfileCreated} />}
            {userType === UserType.THERAPIST && <CreateTherapistProfile onProfileCreated={handleProfileCreated} />}
          </Box>
        )}
        {profile && (
          <Box>
            <Typography variant="h6">Name: {profile.full_name}</Typography>
            {userType === UserType.PATIENT && 'date_of_birth' in profile && (
              <>
                <Typography>Date of Birth: {profile.date_of_birth}</Typography>
                <Typography>Address: {profile.address}</Typography>
                <Typography>Phone Number: {profile.phone_number}</Typography>
              </>
            )}
            {userType === UserType.THERAPIST && 'license_number' in profile && (
              <>
                <Typography>License Number: {profile.license_number}</Typography>
                {/* Add other therapist fields here */}
              </>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Profile;