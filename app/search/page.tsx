"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
// import LocationPicker from '@/components/LocationPicker'; // Replaced with dynamic import
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react'; 

// Dynamically import LocationPicker itself to prevent SSR issues with Leaflet
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

type Therapist = {
  id: number;
  full_name: string;
  specialization: string;
  years_of_experience: number;
  office_address: string;
  profile_picture_url: string;
  rating?: number;
};

export default function SearchPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [specialization, setSpecialization] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const fetchTherapists = async (spec?: string, loc?: string, lat?: number, lon?: number) => {
    setLoading(true);
    try {
      let url = '/profile/therapists/search?';
      const params = new URLSearchParams();
      if (spec) params.append('specialization', spec);
      if (lat && lon) {
          params.append('lat', lat.toString());
          params.append('lon', lon.toString());
          params.append('radius', '50'); // Default 50km
      } else if (loc) {
          params.append('location', loc);
      }

      const res = await api.get<Therapist[]>(url + params.toString());
      setTherapists(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (coords) {
        fetchTherapists(specialization, undefined, coords.lat, coords.lon);
    } else {
        fetchTherapists(specialization, locationQuery);
    }
  };

  const handleLocationSelect = (lat: number, lon: number, address: string) => {
      setCoords({ lat, lon });
      setLocationQuery(address || `Selected on Map (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Therapist</h1>
        
        <form onSubmit={handleSearch} className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Specialization (e.g., Anxiety)"
            className="flex-1 rounded-md border-0 py-2 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          
          <div className="flex-1 relative">
            <input
                type="text"
                placeholder="Location (City or Pick on Map)"
                className="w-full rounded-md border-0 py-2 pl-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                value={locationQuery}
                onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setCoords(null); // Reset map coords if user types
                }}
            />
            <button 
                type="button"
                onClick={() => setShowMap(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                title="Pick on Map"
            >
                <MapPin className="h-5 w-5" />
            </button>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Search
          </button>
        </form>

        {/* LocationPicker is now dynamically imported */}
        {showMap && (
            <LocationPicker 
                isOpen={showMap} 
                onClose={() => setShowMap(false)} 
                onSelect={handleLocationSelect} 
            />
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {therapists.map((therapist) => (
              <div key={therapist.id} className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-gray-400">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={therapist.profile_picture_url || "https://via.placeholder.com/150"}
                    alt={therapist.full_name}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/therapist/${therapist.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{therapist.full_name}</p>
                    <p className="truncate text-sm text-gray-500">
                        {therapist.specialization}
                    </p>
                    <p className="truncate text-sm text-gray-500">{therapist.office_address}</p>
                  </Link>
                </div>
              </div>
            ))}
            {therapists.length === 0 && (
                <p className="text-gray-500">No therapists found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
