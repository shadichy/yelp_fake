# Activity Flow

This document outlines the typical flow of activities for users of the Yelp for Therapists platform.

## 1. New Patient Registration and Finding a Therapist

1.  **Homepage**: A new user arrives at the homepage.
2.  **Select Role**: The user selects the "Patient" role to begin the registration process.
3.  **Registration**: The user provides their email address and creates a password. The system creates a new user account with the "PATIENT" user type.
4.  **Email Verification**: The system sends a verification link to the user's email address.
5.  **Login**: The user clicks the verification link and is redirected to the login page. They log in with their credentials.
6.  **Profile Completion**: After logging in for the first time, the user is prompted to complete their patient profile (full name, date of birth, address, etc.).
7.  **Search**: The user navigates to the search page. They can enter their location and use filters for specialization, availability, etc.
8.  **View Results**: The system displays a list of therapist profiles that match the search criteria.

## 2. Booking an Appointment

1.  **Select Therapist**: The patient clicks on a therapist's profile from the search results.
2.  **View Profile**: The patient reviews the therapist's detailed profile, including their bio, specializations, and reviews from other patients.
3.  **Choose Time Slot**: The patient views the therapist's availability calendar and selects a suitable date and time for the appointment.
4.  **Confirm Booking**: The patient confirms the appointment details. The system creates a new appointment with the status "SCHEDULED".
5.  **Therapist Notification**: The system sends a notification (e.g., email, in-app) to the therapist about the new appointment request.
6.  **Patient Confirmation**: The system sends a confirmation to the patient that their booking request has been sent.
7.  **Appointment Reminders**: The system automatically sends reminders to both the patient and the therapist 24 hours and 1 hour before the scheduled appointment time.

## 3. Managing an Appointment

1.  **Access Dashboard**: The patient or therapist logs into their account and accesses their dashboard.
2.  **View Appointments**: They can see a list of their upcoming and past appointments.
3.  **Select Appointment**: They select a specific appointment to view its details.
4.  **Reschedule/Cancel**: The user has the option to request a reschedule or to cancel the appointment. Rules for cancellations (e.g., 24-hour notice) will apply.
5.  **System Update**: The system updates the appointment status accordingly (e.g., "CANCELLED") and notifies the other party.

## 4. Post-Appointment and Review

1.  **Appointment Completion**: Once the scheduled appointment time has passed, the system automatically marks the appointment as "COMPLETED".
2.  **Review Prompt**: The system sends a notification to the patient, prompting them to leave a review for the therapist.
3.  **Submit Review**: The patient can provide a rating (1-5 stars) and a written comment about their experience.
4.  **Review Visibility**: The submitted review is then displayed on the therapist's public profile.

## 5. Therapist Registration and Profile Management

1.  **Select Role**: A new user selects the "Therapist" role on the registration page.
2.  **Registration**: The user provides their email and creates a password.
3.  **Profile Setup**: The therapist is guided through a multi-step process to build their professional profile, including:
    - Personal Information (name, contact)
    - Professional Credentials (license number, certifications)
    - Specializations and Expertise
    - Office Location (address is used to calculate coordinates for map display)
    - Profile Picture and Bio
4.  **Set Availability**: The therapist defines their weekly working hours and marks any specific unavailable times on their calendar.
5.  **Profile Activation**: After the profile is complete, it becomes visible in search results to patients.