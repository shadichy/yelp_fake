"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

type TherapistProfile = {
  full_name: string;
  license_number: string;
  specialization?: string;
  years_of_experience?: number;
  office_address?: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
};

export default function TherapistProfileForm({ existingProfile, onSave }: { existingProfile?: TherapistProfile, onSave: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TherapistProfile>({
    defaultValues: existingProfile
  });
  const [error, setError] = useState('');

  const onSubmit = async (data: TherapistProfile) => {
    try {
      // Basic geocoding mock if coords not provided (client side or server side better? Server side mock done via activity_flow? No.
      // We will just send what we have. User might input lat/lon manually for now or we skip it.)
      // The backend expects lat/lon for search.
      // Let's just ask for them or default them if missing? 
      // Backend schema allows optional.
      
      if (existingProfile) {
        await api.put('/profile/therapist', data);
      } else {
        await api.post('/profile/therapist', data);
      }
      onSave();
    } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.detail || 'Failed to save profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
        <div className="mt-2">
          <input 
            {...register('full_name', { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">License Number</label>
        <div className="mt-2">
          <input 
            {...register('license_number', { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Specialization</label>
        <div className="mt-2">
          <input 
            {...register('specialization')}
            placeholder="e.g. Anxiety, Depression"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Years of Experience</label>
        <div className="mt-2">
          <input 
            type="number"
            {...register('years_of_experience')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Office Address</label>
        <div className="mt-2">
          <input 
            {...register('office_address')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

       <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
        <div className="mt-2">
          <input 
            {...register('phone_number')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Latitude</label>
            <div className="mt-2">
            <input 
                type="number"
                step="any"
                {...register('latitude')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Longitude</label>
            <div className="mt-2">
            <input 
                type="number"
                step="any"
                {...register('longitude')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
            </div>
        </div>
       </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
        Save Profile
      </button>
    </form>
  );
}
