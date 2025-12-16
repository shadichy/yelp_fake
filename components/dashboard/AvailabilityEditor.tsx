"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

type Availability = {
  id: number;
  start_time: string;
  end_time: string;
};

type AvailabilityFormData = {
    date: string;
    start_time: string;
    end_time: string;
}

export default function AvailabilityEditor({ therapistId }: { therapistId: number }) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const { register, handleSubmit, reset } = useForm<AvailabilityFormData>();

  const fetchAvailability = async () => {
    try {
      const res = await api.get<Availability[]>(`/availability/?therapist_id=${therapistId}`);
      setAvailabilities(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (therapistId) fetchAvailability();
  }, [therapistId]);

  const onSubmit = async (data: AvailabilityFormData) => {
    try {
        const start = new Date(`${data.date}T${data.start_time}`);
        const end = new Date(`${data.date}T${data.end_time}`);

        await api.post('/availability/', {
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            is_available: true
        });
        reset();
        fetchAvailability();
    } catch (error) {
        console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
        await api.delete(`/availability/${id}`);
        fetchAvailability();
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold mb-4">Manage Availability</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6 items-end">
        <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" {...register('date', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input type="time" {...register('start_time', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input type="time" {...register('end_time', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">Add Slot</button>
      </form>

      <ul className="divide-y divide-gray-200">
        {availabilities.map((slot) => (
            <li key={slot.id} className="py-3 flex justify-between items-center">
                <span className="text-sm text-gray-900">
                    {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleTimeString()}
                </span>
                <button onClick={() => handleDelete(slot.id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
            </li>
        ))}
      </ul>
    </div>
  );
}