"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import PatientProfileForm from '@/components/dashboard/PatientProfileForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const profileRes = await api.get('/profile/me');
      setProfile(profileRes.data);

      const appointmentsRes = await api.get<any[]>('/appointments/');
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_type !== 'PATIENT') {
        // router.push('/'); // Or handle redirects in AuthContext or Layout
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                {profile ? (
                    <div>
                        <p><strong>Name:</strong> {profile.full_name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Phone:</strong> {profile.phone_number}</p>
                        <button onClick={() => setProfile(null)} className="mt-4 text-blue-600 text-sm">Edit Profile</button>
                    </div>
                ) : (
                    <PatientProfileForm onSave={fetchData} />
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                {appointments.length === 0 ? (
                    <p className="text-gray-500">No appointments scheduled.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {appointments.map((appt) => (
                            <li key={appt.id} className="py-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Therapist ID: {appt.therapist_id}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(appt.start_time).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${appt.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'}`}>
                                        {appt.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-4">
                    <a href="/search" className="text-blue-600 text-sm font-medium">Book a new appointment &rarr;</a>
                </div>
            </div>
        </div>
    </div>
  );
}