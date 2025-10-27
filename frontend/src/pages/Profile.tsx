import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, CircularProgress, Button } from '@mui/material';
import CreatePatientProfile from '../components/CreatePatientProfile';
import CreateTherapistProfile from '../components/CreateTherapistProfile';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch('http://127.0.0.1:8000/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        const userData = await fetch('http://127.0.0.1:8000/users/me', { // This endpoint does not exist yet
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = await userData.json();
        setUserType(user.user_type);
        setShowCreateForm(true);
        setProfile(null);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      setUserType(data.user_type);
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.message);
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
            {userType === 'PATIENT' && <CreatePatientProfile onProfileCreated={handleProfileCreated} />}
            {userType === 'THERAPIST' && <CreateTherapistProfile onProfileCreated={handleProfileCreated} />}
          </Box>
        )}
        {profile && (
          <Box>
            <Typography variant="h6">Name: {profile.full_name}</Typography>
            {userType === 'PATIENT' && (
              <>
                <Typography>Date of Birth: {profile.date_of_birth}</Typography>
                <Typography>Address: {profile.address}</Typography>
                <Typography>Phone Number: {profile.phone_number}</Typography>
              </>
            )}
            {userType === 'THERAPIST' && (
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