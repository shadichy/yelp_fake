# Activity Flow

This document outlines the typical flow of activities for users of the platform.

## 1. New Patient Registration and Finding a Therapist

1.  **Homepage**: A new user arrives at the homepage.
2.  **Select Role**: The user selects the "Patient" role to begin the registration process.
3.  **Registration**: The user provides their email address and creates a password. The system creates a new user account with the "PATIENT" user type.
4.  **Email Verification**: The system sends a verification link to the user's email address.
5.  **Login**: The user clicks the verification link, their account is marked as verified, and they are redirected to the login page. They log in with their credentials.
6.  **Profile Completion**: After logging in for the first time, the user is prompted to complete their patient profile (full name, date of birth, address, etc.).
7.  **Search**: The user navigates to the search page. They can enter their location and use filters for specialization, availability, etc.
8.  **View Results**: The system displays a list of therapist profiles that match the search criteria.

## 2. Therapist Registration and Profile Management

1.  **Select Role**: A new user selects the "Therapist" role on the registration page.
2.  **Registration**: The user provides their email and creates a password.
3.  **Email Verification**: The system sends a verification link to the therapist's email. Clicking this link verifies their email address and activates their account, allowing them to log in.
4.  **Login & Profile Setup**: The therapist logs in and is guided through a multi-step process to build their professional profile, including:
    -   Personal Information (name, contact)
    -   Professional Credentials (license number, certifications)
    -   Specializations and Expertise
    -   Office Location (address is used to calculate coordinates for map display)
    -   Profile Picture and Bio
5.  **Set Availability**: The therapist defines their weekly working hours and marks any specific unavailable times on their calendar.
6.  **Profile Activation**: After the profile is complete, it becomes visible in search results to patients.

## 3. Admin System Management

1.  **Access Admin Login**: The Admin navigates to the `/admin` URL.
2.  **Login**: The Admin enters their credentials (email and password) into the login form.
3.  **Authentication**: The system verifies the credentials and checks if the user has the `ADMIN` role.
4.  **Access Dashboard**: Upon successful authentication, the Admin is granted access to the admin dashboard.
5.  **Manage Data**: The Admin can perform CRUD (Create, Read, Update, Delete) operations on Users, Patients, Therapists, and other system models.

## 4. Booking an Appointment

1.  **Select Therapist**: The patient clicks on a therapist's profile from the search results.
2.  **View Profile**: The patient reviews the therapist's detailed profile.
3.  **Choose Time Slot**: The patient views the therapist's availability calendar and selects a suitable date and time.
4.  **Confirm Booking**: The patient confirms the appointment details. The system creates a new appointment with the status "SCHEDULED".
5.  **Notifications**: The system sends notifications to both the patient and the therapist about the new appointment.

## 5. Managing an Appointment

1.  **Access Dashboard**: The patient or therapist logs into their account and accesses their dashboard.
2.  **View Appointments**: They can see a list of their upcoming and past appointments.
3.  **Reschedule/Cancel**: The user has the option to request a reschedule or to cancel the appointment.
4.  **System Update**: The system updates the appointment status and notifies the other party.

## 6. Post-Appointment and Review

1.  **Appointment Completion**: The system marks the appointment as "COMPLETED" after the scheduled time has passed.
2.  **Review Prompt**: The system prompts the patient to leave a review for the therapist.
3.  **Submit Review**: The patient provides a rating and a written comment.
4.  **Review Visibility**: The submitted review is then displayed on the therapist's public profile.
