# Database Schema

## Users Table
- `user_id` (Primary Key, UUID)
- `email` (String, Unique)
- `password_hash` (String)
- `user_type` (Enum: "PATIENT", "THERAPIST")
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Patients Table
- `patient_id` (Primary Key, Foreign Key to Users.user_id)
- `full_name` (String)
- `date_of_birth` (Date)
- `address` (String)
- `phone_number` (String)
- `profile_picture_url` (String)

## Therapists Table
- `therapist_id` (Primary Key, Foreign Key to Users.user_id)
- `full_name` (String)
- `license_number` (String, Unique)
- `specialization` (Array of Strings)
- `years_of_experience` (Integer)
- `office_address` (String)
- `latitude` (Float)
- `longitude` (Float)
- `phone_number` (String)
- `website` (String)
- `availability` (JSONB)
- `profile_picture_url` (String)

## Appointments Table
- `appointment_id` (Primary Key, UUID)
- `patient_id` (Foreign Key to Patients.patient_id)
- `therapist_id` (Foreign Key to Therapists.therapist_id)
- `appointment_datetime` (Timestamp)
- `duration_minutes` (Integer)
- `status` (Enum: "SCHEDULED", "COMPLETED", "CANCELLED")
- `notes` (Text)
- `created_at` (Timestamp)

## Reviews Table
- `review_id` (Primary Key, UUID)
- `patient_id` (Foreign Key to Patients.patient_id)
- `therapist_id` (Foreign Key to Therapists.therapist_id)
- `rating` (Integer, 1-5)
- `comment` (Text)
- `created_at` (Timestamp)

## Messages Table
- `message_id` (Primary Key, UUID)
- `sender_id` (Foreign Key to Users.user_id)
- `receiver_id` (Foreign Key to Users.user_id)
- `content` (Text)
- `sent_at` (Timestamp)