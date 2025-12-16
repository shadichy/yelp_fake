"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Therapist = {
  id: number;
  full_name: string;
  specialization: string;
  years_of_experience: number;
  office_address: string;
  phone_number: string;
  profile_picture_url: string;
};

type Availability = {
    id: number;
    start_time: string;
    end_time: string;
}

type Review = {
    id: number;
    rating: number;
    comment: string;
    created_at: string; // or Date
}

export default function TherapistProfile() {
  const { id } = useParams();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  
  // Message Modal State
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    if (id) {
        Promise.all([
            api.get<Therapist>(`/profile/therapist/${id}`),
            api.get<Availability[]>(`/availability/?therapist_id=${id}`),
            api.get<Review[]>(`/reviews/${id}`)
        ]).then(([profileRes, availRes, reviewsRes]) => {
            setTherapist(profileRes.data);
            setAvailabilities(availRes.data);
            setReviews(reviewsRes.data);
        }).catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBook = async (slot: Availability) => {
      if (!user) {
          router.push('/login');
          return;
      }
      try {
          await api.post('/appointments/', {
              therapist_id: Number(id),
              start_time: slot.start_time,
              end_time: slot.end_time
          });
          alert('Appointment requested!');
          // Refresh availability? Technically the slot might still be visible until approved/taken logic updates it.
      } catch (error) {
          console.error(error);
          alert('Failed to book appointment.');
      }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
          router.push('/login');
          return;
      }
      try {
          await api.post('/messages/', {
              receiver_id: Number(id),
              content: messageContent
          });
          setShowMessageModal(false);
          setMessageContent('');
          alert('Message sent!');
          router.push('/messages');
      } catch (error) {
          console.error(error);
          alert('Failed to send message.');
      }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!therapist) return <div className="p-8">Therapist not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-200">
                <div className="px-4 py-5 sm:px-6 flex items-center">
                    <img
                        className="h-24 w-24 rounded-full object-cover mr-6 border-2 border-gray-200"
                        src={therapist.profile_picture_url || "https://via.placeholder.com/150"}
                        alt={therapist.full_name}
                    />
                    <div>
                        <h3 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">{therapist.full_name}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{therapist.specialization}</p>
                        <div className="mt-4 flex space-x-3">
                            <button 
                                onClick={() => setShowMessageModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                Message
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Experience</dt>
                            <dd className="mt-1 text-sm text-gray-900">{therapist.years_of_experience} years</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Office Address</dt>
                            <dd className="mt-1 text-sm text-gray-900">{therapist.office_address}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Contact</dt>
                            <dd className="mt-1 text-sm text-gray-900">{therapist.phone_number}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reviews</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                     {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                     ) : (
                        <ul className="space-y-4">
                            {reviews.map((review) => (
                                <li key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center mb-1">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ml-2 text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{review.comment}</p>
                                </li>
                            ))}
                        </ul>
                     )}
                </div>
            </div>
        </div>

        {/* Sidebar: Availability */}
        <div className="lg:col-span-1">
            <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-200 sticky top-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-blue-50">
                    <h3 className="text-lg leading-6 font-medium text-blue-900">Available Slots</h3>
                </div>
                <div className="px-4 py-5 sm:p-6 max-h-[600px] overflow-y-auto">
                    {availabilities.length === 0 ? (
                        <p className="text-gray-500 text-sm">No availability listed.</p>
                    ) : (
                        <ul className="space-y-3">
                            {availabilities.map((slot) => (
                                <li key={slot.id} className="flex flex-col bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                        {new Date(slot.start_time).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {new Date(slot.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(slot.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <button 
                                        onClick={() => handleBook(slot)}
                                        className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Book Appointment
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Send Message to {therapist.full_name}</h3>
                  <form onSubmit={handleSendMessage}>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Write your message here..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        required
                      />
                      <div className="flex justify-end space-x-3">
                          <button 
                            type="button" 
                            onClick={() => setShowMessageModal(false)}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                              Send
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
}
