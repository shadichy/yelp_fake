
import { useState, useEffect, type ChangeEvent } from 'react';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';
import type { Availability as AvailabilityType } from '../types/availability';
import { UserType } from '../schemas/enums';

const Availability: FC = () => {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (user && user.user_type === UserType.THERAPIST) {
        try {
          const response = await api.get<AvailabilityType[]>(`/availability/?therapist_id=${user.id}`);
          setAvailabilities(response.data);
        } catch (error) {
          console.error('Error fetching availabilities:', error);
        }
      }
    };
    fetchAvailabilities();
  }, [user]);

  const handleAddAvailability = async () => {
    try {
      const response = await api.post<AvailabilityType>('/availability/', { start_time: startTime, end_time: endTime });
      setAvailabilities([...availabilities, response.data]);
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error adding availability:', error);
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      await api.delete(`/availability/${id}`);
      setAvailabilities(availabilities.filter((avail) => avail.id !== id));
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  if (user?.user_type !== UserType.THERAPIST) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div>
      <h2>My Availabilities</h2>
      <div>
        <h3>Add New Availability</h3>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddAvailability}>Add</button>
      </div>
      <div>
        <h3>Current Availabilities</h3>
        <ul>
          {availabilities.map((avail) => (
            <li key={avail.id}>
              {new Date(avail.start_time).toLocaleString()} - {new Date(avail.end_time).toLocaleString()}
              <button onClick={() => handleDeleteAvailability(avail.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Availability;
