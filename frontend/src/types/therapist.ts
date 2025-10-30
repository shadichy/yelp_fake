
export interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  office_address: string;
  phone_number: string;
  website: string;
  years_of_experience: number;
  availability: string;
  profile_picture_url: string;
  latitude: number | null;
  longitude: number | null;
}
