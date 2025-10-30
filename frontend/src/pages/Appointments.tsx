
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';

interface Appointment {
  id: number;
  patient_id: number;
  therapist_id: number;
  start_time: string;
  end_time: string;
  status: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated) {
      api.get('/appointments/').then((response) => {
        setAppointments(response.data);
      });
    }
  }, [auth.isAuthenticated]);

  const handleCancelAppointment = (id: number) => {
    api.patch(`/appointments/${id}`, { status: 'CANCELLED' })
      .then((response) => {
        setAppointments(appointments.map(a => a.id === id ? response.data : a));
      })
      .catch((error) => {
        console.error('Error cancelling appointment:', error);
      });
  }

  const handleConfirmAppointment = (id: number) => {
    api.patch(`/appointments/${id}`, { status: 'CONFIRMED' })
      .then((response) => {
        setAppointments(appointments.map(a => a.id === id ? response.data : a));
      })
      .catch((error) => {
        console.error('Error confirming appointment:', error);
      });
  }

  return (
    <div>
      <h2>My Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <p>Therapist ID: {appointment.therapist_id}</p>
            <p>Patient ID: {appointment.patient_id}</p>
            <p>Start: {new Date(appointment.start_time).toLocaleString()}</p>
            <p>End: {new Date(appointment.end_time).toLocaleString()}</p>
            <p>Status: {appointment.status}</p>
            {auth.user?.user_type === 'THERAPIST' && appointment.status === 'PENDING' && (
              <button onClick={() => handleConfirmAppointment(appointment.id)}>Confirm</button>
            )}
            {(auth.user?.user_type === 'PATIENT' || auth.user?.user_type === 'THERAPIST') && appointment.status !== 'CANCELLED' && (
              <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
