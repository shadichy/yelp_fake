# Database Schema

This document outlines the database schema based on the SQLAlchemy models.

## Users Table (`users`)
- `id` (Integer, Primary Key)
- `email` (String, Unique, Not Null)
- `hashed_password` (String, Not Null)
- `verified` (Boolean, Not Null, Default: `False`)
- `user_type` (Enum: "PATIENT", "THERAPIST", "ADMIN", Not Null)
- `created_at` (DateTime, Default: `now()`)
- `updated_at` (DateTime, On Update: `now()`)

## Patients Table (`patients`)
- `id` (Integer, Primary Key, Foreign Key to `users.id`)
- `full_name` (String, Not Null)
- `date_of_birth` (Date)
- `address` (String)
- `phone_number` (String)
- `profile_picture_url` (String)

## Therapists Table (`therapists`)
- `id` (Integer, Primary Key, Foreign Key to `users.id`)
- `full_name` (String, Not Null)
- `license_number` (String, Unique, Not Null)
- `specialization` (String)
- `years_of_experience` (Integer)
- `office_address` (String)
- `latitude` (Float)
- `longitude` (Float)
- `phone_number` (String)
- `website` (String)
- `availability` (String)
- `profile_picture_url` (String)

## Verification Tokens Table (`verification_tokens`)
- `id` (Integer, Primary Key)
- `token` (String, Unique, Not Null)
- `user_id` (Integer, Foreign Key to `users.id`, Not Null)
- `expires_at` (DateTime, Not Null)
- `created_at` (DateTime, Default: `now()`)

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
