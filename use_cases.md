# Use Cases

## Actors
- **Patient**: An individual seeking therapy services.
- **Therapist**: A licensed professional providing therapy services.
- **Admin**: A system administrator responsible for managing the platform.
- **System**: The platform itself.

## Patient Use Cases

- **UC-01: Register and Create Profile**
  - **Description**: A new user can register as a patient, verify their email, and create a personal profile with their information.
  - **Actors**: Patient, System

- **UC-02: Search for Therapists**
  - **Description**: A patient can search for therapists based on various criteria like location, specialization, availability, etc.
  - **Actors**: Patient, System

- **UC-03: View Therapist Profile**
  - **Description**: A patient can view the detailed profile of a therapist, including their qualifications, experience, reviews, and availability.
  - **Actors**: Patient, System

- **UC-04: Book Appointment**
  - **Description**: A patient can book an available appointment slot with a therapist.
  - **Actors**: Patient, System

- **UC-05: Manage Appointments**
  - **Description**: A patient can view, reschedule, or cancel their upcoming appointments.
  - **Actors**: Patient, System

- **UC-06: Leave Review**
  - **Description**: A patient can leave a rating and a written review for a therapist after a completed appointment.
  - **Actors**: Patient, System

- **UC-07: Send and Receive Messages**
  - **Description**: A patient can communicate with a therapist through a secure messaging system.
  - **Actors**: Patient, Therapist, System

## Therapist Use Cases

- **UC-08: Register and Create Professional Profile**
  - **Description**: A new user can register as a therapist, verify their account via an email link, and create a professional profile with their credentials, specialization, and other relevant information.
  - **Actors**: Therapist, System

- **UC-09: Manage Availability**
  - **Description**: A therapist can set and manage their working hours and availability for appointments.
  - **Actors**: Therapist, System

- **UC-10: Manage Appointments**
  - **Description**: A therapist can view, approve, or decline appointment requests from patients.
  - **Actors**: Therapist, System

- **UC-11: View Patient Profile**
  - **Description**: A therapist can view the profile of a patient who has booked an appointment with them.
  - **Actors**: Therapist, System

## Admin Use Cases

- **UC-12: Manage Users and Data**
  - **Description**: An admin can log into a dedicated admin dashboard to perform CRUD operations on all system data, including users (patients, therapists), profiles, and appointments.
  - **Actors**: Admin, System
