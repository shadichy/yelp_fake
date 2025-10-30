
import { useState, type ChangeEvent } from 'react';
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
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Therapist } from '../types/therapist';

const Search: FC = () => {
  const [specialization, setSpecialization] = useState<string>('');
  const [lat, setLat] = useState<number | ''>(34.0522);
  const [lon, setLon] = useState<number | ''>(-118.2437);
  const [radius, setRadius] = useState<number | ''>(10);
  const [results, setResults] = useState<Therapist[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await api.get<Therapist[]>('/profile/therapists/search', {
        params: {
          specialization,
          lat: lat === '' ? undefined : lat,
          lon: lon === '' ? undefined : lon,
          radius: radius === '' ? undefined : radius,
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleTherapistClick = (therapistId: number) => {
    sessionStorage.setItem('selectedTherapistId', String(therapistId));
    // navigate(`/therapist/${therapistId}`);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Therapist Search
      </Typography>
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
          <Grid size={{ xs: 12, sm: 2 }} component="div">
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={lat}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLat(e.target.value === '' ? '' : parseFloat(e.target.value))
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} component="div">
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={lon}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLon(e.target.value === '' ? '' : parseFloat(e.target.value))
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} component="div">
            <TextField
              fullWidth
              label="Radius (km)"
              type="number"
              value={radius}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRadius(e.target.value === '' ? '' : parseFloat(e.target.value))
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }} component="div">
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <MapContainer center={[lat || 34.0522, lon || -118.2437]} zoom={10} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {results.map((therapist) => (
              therapist.latitude && therapist.longitude && (
                <Marker key={therapist.id} position={[therapist.latitude, therapist.longitude]}>
                  <Popup>
                    {therapist.full_name} <br /> {therapist.office_address}
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} component="div">
          <Box sx={{ height: '500px', overflowY: 'auto' }}>
            <Grid container spacing={2}>
              {results.map((therapist) => (
                <Grid size={{ xs: 12 }} key={therapist.id} component="div">
                  <Card onClick={() => handleTherapistClick(therapist.id)} style={{ cursor: 'pointer' }}>
                    <CardContent>
                      <Typography variant="h6">{therapist.full_name}</Typography>
                      <Typography>Specialization: {therapist.specialization}</Typography>
                      <Typography>Address: {therapist.office_address}</Typography>
                      <Typography>Phone: {therapist.phone_number}</Typography>
                      {therapist.website && (
                        <Typography>Website: <a href={therapist.website} target="_blank" rel="noopener noreferrer">{therapist.website}</a></Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
