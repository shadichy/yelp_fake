"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import TherapistProfileForm from '@/components/dashboard/TherapistProfileForm';
import AvailabilityEditor from '@/components/dashboard/AvailabilityEditor';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TherapistDashboard() {
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
        if (user?.user_type !== 'THERAPIST') {
            // router.push('/'); 
        }
        fetchData();
    }, []);

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await api.patch(`/appointments/${id}`, { status });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Therapist Dashboard</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Professional Profile</h2>
                        {profile ? (
                            <div>
                                <p><strong>Name:</strong> {profile.full_name}</p>
                                <p><strong>License:</strong> {profile.license_number}</p>
                                <p><strong>Specialization:</strong> {profile.specialization}</p>
                                <p><strong>Office:</strong> {profile.office_address}</p>
                                <button onClick={() => setProfile(null)} className="mt-4 text-blue-600 text-sm">Edit Profile</button>
                            </div>
                        ) : (
                            <TherapistProfileForm onSave={fetchData} />
                        )}
                    </div>

                    {profile && <AvailabilityEditor therapistId={profile.id} />}
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Appointment Requests</h2>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments scheduled.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {appointments.toReversed().map((appt) => (
                                <li key={appt.id} className="py-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">Patient ID: {appt.patient_id}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(appt.start_time).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${appt.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'}`}>
                                                {appt.status}
                                            </span>
                                            {appt.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStatusChange(appt.id, 'CONFIRMED')} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Accept</button>
                                                    <button onClick={() => handleStatusChange(appt.id, 'CANCELLED')} className="text-xs bg-red-600 text-white px-2 py-1 rounded">Decline</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}