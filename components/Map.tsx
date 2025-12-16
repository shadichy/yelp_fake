"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css'; // Globally imported in layout.tsx
// import L from 'leaflet'; // REMOVE direct import
import { useEffect } from 'react';
import { LeafletMouseEvent } from 'leaflet'; // Import for typing

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  const mapEvents = useMapEvents({
    click(e: LeafletMouseEvent) { // Typed 'e' here
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function ChangeMapView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// This component now contains the actual Leaflet rendering logic
export default function Map({ center, selectedPosition, onPositionSelect }: { center: [number, number], selectedPosition: [number, number] | null, onPositionSelect: (pos: [number, number]) => void }) {
  useEffect(() => {
    // Fix Leaflet icons: only run on client-side and after L is available
    if (typeof window !== 'undefined' && (window as any).L) {
      const L = (window as any).L;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []); // Run once on client mount

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <ChangeMapView center={center} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={selectedPosition} setPosition={onPositionSelect} />
    </MapContainer>
  );
}
