
import { useState, useEffect, type ChangeEvent, useRef, useCallback } from 'react';
import type { FC } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  Rating,
  Modal,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Therapist } from '../types/therapist';
import LocationPicker from '../components/LocationPicker';

const Search: FC = () => {
  const [specialization, setSpecialization] = useState<string>('');
  const [results, setResults] = useState<Therapist[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  const itemsPerPage = 10;

  const lastResultRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleSearch(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    const getLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
          },
          async (error) => {
            console.error('Error getting browser location:', error);
            // Fallback to IP location
            try {
              const response = await fetch('https://ipapi.co/json/');
              const data = await response.json();
              setUserLocation({ lat: data.latitude, lon: data.longitude });
            } catch (ipError) {
              console.error('Error getting IP location:', ipError);
              setError('Could not determine your location.');
            }
          }
        );
      } catch (error) {
        console.error('Error getting location:', error);
        setError('Could not determine your location.');
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      handleSearch(true);
    }
  }, [userLocation]);

  const handleSearch = async (isNewSearch = false) => {
    setError(null);
    if (isNewSearch) {
      setPage(1);
      setResults([]);
    }

    const lat = userLocation?.lat;
    const lon = userLocation?.lon;

    if (lat === undefined || lon === undefined) {
      setError('Location not set.');
      return;
    }

    try {
      const response = await api.get<Therapist[]>('/profile/therapists/search', {
        params: {
          specialization,
          lat,
          lon,
          radius: 50, // Hardcoded for now
          page: isNewSearch ? 1 : page,
          limit: itemsPerPage,
        },
      });
      setResults((prevResults) => (isNewSearch ? response.data : [...prevResults, ...response.data]));
      setPage((prevPage) => (isNewSearch ? 2 : prevPage + 1));
      setHasMore(response.data.length === itemsPerPage);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed.');
    }
  };

  const handleTherapistClick = (therapistId: number) => {
    sessionStorage.setItem('selectedTherapistId', String(therapistId));
    navigate(`/therapist/${therapistId}`);
  };

  const handleChangeLocation = () => {
    setIsModalOpen(true);
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Therapist Search
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }} component="div">
            <TextField
              fullWidth
              label="Specialization"
              value={specialization}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecialization(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }} component="div">
            <Button variant="contained" onClick={() => handleSearch(true)}>
              Search
            </Button>
            <Button variant="outlined" sx={{ ml: 1 }} onClick={handleChangeLocation}>
              Change Location
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {results.map((therapist, index) => (
          <Grid
            size={{ xs: 12 }}
            key={therapist.id}
            ref={index === results.length - 1 ? lastResultRef : null}
            component="div"
          >
            <Card onClick={() => handleTherapistClick(therapist.id)} style={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6">{therapist.full_name}</Typography>
                <Typography>Specialization: {therapist.specialization}</Typography>
                <Typography>Address: {therapist.office_address}</Typography>
                <Rating value={therapist.average_rating} readOnly />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!hasMore && <Typography sx={{ textAlign: 'center', mt: 2 }}>No more results</Typography>}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </Box>
      </Modal>
    </Container>
  );
};

export default Search;
