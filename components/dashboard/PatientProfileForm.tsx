"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

type PatientProfile = {
  full_name: string;
  date_of_birth?: string;
  address?: string;
  phone_number?: string;
};

export default function PatientProfileForm({ existingProfile, onSave }: { existingProfile?: PatientProfile, onSave: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PatientProfile>({
    defaultValues: existingProfile
  });
  const [error, setError] = useState('');

  const onSubmit = async (data: PatientProfile) => {
    try {
        // Format date to YYYY-MM-DD if present
        if (data.date_of_birth) {
            data.date_of_birth = new Date(data.date_of_birth).toISOString().split('T')[0];
        }

      if (existingProfile) {
        await api.put('/profile/patient', data);
      } else {
        await api.post('/profile/patient', data);
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
          {errors.full_name && <span className="text-red-500 text-xs">This field is required</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Date of Birth</label>
        <div className="mt-2">
          <input 
            type="date"
            {...register('date_of_birth')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Address</label>
        <div className="mt-2">
          <input 
            {...register('address')}
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

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
        Save Profile
      </button>
    </form>
  );
}
