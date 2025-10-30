
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';

interface Availability {
  id: number;
  start_time: string;
  end_time: string;
}

const Availability = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.user?.user_type === 'THERAPIST') {
      api.get(`/availability/?therapist_id=${auth.user.id}`).then((response) => {
        setAvailabilities(response.data);
      });
    }
  }, [auth.user]);

  const handleAddAvailability = () => {
    api.post('/availability/', { start_time: startTime, end_time: endTime })
      .then((response) => {
        setAvailabilities([...availabilities, response.data]);
        setStartTime('');
        setEndTime('');
      })
      .catch((error) => {
        console.error('Error adding availability:', error);
      });
  };

  const handleDeleteAvailability = (id: number) => {
    api.delete(`/availability/${id}`)
      .then(() => {
        setAvailabilities(availabilities.filter((avail) => avail.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting availability:', error);
      });
  };

  if (auth.user?.user_type !== 'THERAPIST') {
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
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
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
