"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
// 'leaflet/dist/leaflet.css'; // Make sure Leaflet CSS is imported globally in layout.tsx.

// Fix Leaflet icons (needed for dynamic import as well)
// This part must be handled carefully. It should not be here.
// It's part of the actual map component (Map.tsx)

const DynamicMap = dynamic(() => import('./Map'), { ssr: false });

export default function LocationPicker({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (lat: number, lon: number, address: string) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC

  useEffect(() => {
    // Reset state when dialog opens/closes
    if (isOpen) {
        setPosition(null);
        setAddressSearchQuery('');
        setMapCenter([40.7128, -74.0060]); // Reset to default center
    }
  }, [isOpen]);

  const handleGeocodeSearch = async () => {
    if (!addressSearchQuery.trim()) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressSearchQuery)}&format=json&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]); // Update map center
        setPosition([lat, lon]); // Set marker
      } else {
        alert('Location not found!');
      }
    } catch (error) {
      console.error('Error geocoding:', error);
      alert('Error searching for location.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[600px] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pick a Location</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 flex gap-2">
            <input 
                type="text"
                placeholder="Search address..."
                value={addressSearchQuery}
                onChange={(e) => setAddressSearchQuery(e.target.value)}
                className="flex-1 rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            />
            <button 
                type="button"
                onClick={handleGeocodeSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold"
            >
                Search
            </button>
        </div>

        <div className="flex-1 relative">
            {/* Render the dynamically imported map */}
            <DynamicMap center={mapCenter} selectedPosition={position} onPositionSelect={setPosition} />
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
             <div className="flex-1 text-sm text-gray-600 flex items-center">
                {position ? `Selected: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}` : 'Click on the map to select a location'}
             </div>
             <button 
                onClick={() => {
                    if (position) {
                        // For now, pass an empty string for address; a reverse geocode would be needed for a proper address string.
                        onSelect(position[0], position[1], addressSearchQuery || `${position[0].toFixed(4)}, ${position[1].toFixed(4)}`);
                        onClose();
                    }
                }}
                disabled={!position}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
             >
                Confirm Location
             </button>
        </div>
      </div>
    </div>
  );
}
