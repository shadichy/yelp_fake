import { useState, type FC } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Box, TextField, Button } from '@mui/material';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lon: number, address: string) => void;
}

const LocationPicker: FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState('');

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          label="Search for a location"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Box>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && <Marker position={position} />}
        <MapEvents />
      </MapContainer>
      <Button
        variant="contained"
        onClick={() => onLocationSelect(position![0], position![1], address)}
        disabled={!position}
        sx={{ mt: 2 }}
      >
        Select Location
      </Button>
    </Box>
  );
};

export default LocationPicker;
