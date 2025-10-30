
import { UserType } from '../schemas/enums';

export interface BaseProfile {
  id: number;
  full_name: string;
  user_id: number;
}

export interface UserProfile {
  id: number;
  full_name: string;
}

export interface PatientProfile extends BaseProfile {
  date_of_birth: string;
  address: string;
  phone_number: string;
}

export interface TherapistProfile extends BaseProfile {
  license_number: string;
  specialization: string;
  bio: string;
}

export type Profile = PatientProfile | TherapistProfile;

export interface ProfileResponse {
  profile: Profile;
  user_type: UserType;
}
