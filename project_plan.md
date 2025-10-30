# Project Plan: Yelp

## 1. Project Overview

- **Project Name**: Yelp
- **Mission**: To create a trusted and easy-to-use platform that connects individuals seeking mental health support with qualified local therapists. The platform will facilitate discovery, booking, and communication in a secure and confidential manner.

## 2. Core Features

- **Advanced Therapist Search**: Patients can search for therapists using location-based queries and filter results by specialization, availability, and patient reviews.
- **Comprehensive Therapist Profiles**: Therapists can create detailed profiles showcasing their qualifications, experience, and specializations.
- **Seamless Appointment Management**: An integrated calendar system allows patients to book appointments and for both parties to manage their schedules.
- **Verified Patient Reviews**: Patients can leave reviews after a completed appointment, building a transparent reputation system.
- **Secure Messaging Portal**: A confidential messaging system for patients and therapists to communicate.
- **User Authentication**: Separate, secure registration and login flows for Patients and Therapists, with email verification.
- **Admin Dashboard**: A dedicated interface for administrators to manage all system data, including users and profiles.

## 3. Technology Stack

### Frontend

- **Language**: **TypeScript**
- **Framework**: **React** (using Vite)
- **Styling**: **SCSS**
- **UI Library**: **MUI (Material-UI) for React**
- **Mapping**: **OpenStreetMap** with **React-Leaflet**.
- **State Management**: **Redux Toolkit**.
- **Routing**: **React Router**.

### Backend

- **Language**: **Python**
- **Framework**: **FastAPI**
- **Database**: **PostgreSQL** (production) / **SQLite** (development).
- **ORM**: **SQLAlchemy 2.0** with `Mapped` and `mapped_column`.
- **Admin Panel**: **FastAPI Admin** for a simple and integrated admin interface.
- **Type Safety**: **MyPy** (strict mode).
- **Data Validation**: **Pydantic**.
- **API Testing**: **Pytest**.
- **Authentication**: JWT (JSON Web Tokens).
- **Mail Server**: Local mail server for development (e.g., using `aiosmtpd`).

## 4. Development Strategy

1.  **Phase 1: Backend Foundation**
    - Initialize the FastAPI project structure.
    - Define the database schema using SQLAlchemy models (`User`, `Profile`, `VerificationToken`).
    - Implement user registration with email verification and JWT-based authentication.
    - Create CRUD API endpoints for therapist profile management.

2.  **Phase 2: Admin Panel Implementation**
    - Integrate `fastapi-admin` into the backend.
    - Create admin resources for all database models.
    - Implement authentication for the admin panel, restricted to `ADMIN` users.

3.  **Phase 3: Frontend Scaffolding**
    - Set up the React + TypeScript project using Vite.
    - Configure SCSS and install MUI (Material-UI).
    - Implement the main application layout, routing, and navigation.
    - Build the registration and login pages and connect them to the backend.

4.  **Phase 4: Core Feature Implementation (Search & Profiles)**
    - **BE**: Develop the therapist search API endpoint with filtering logic.
    - **FE**: Build the therapist search page with map view and filter components.
    - **FE**: Create the component for displaying detailed therapist profiles.

5.  **Phase 5: Appointment Booking**
    - **BE**: Create API endpoints for managing availability and booking appointments.
    - **FE**: Implement the therapist availability calendar and booking flow.

6.  **Phase 6: Reviews & Messaging**
    - **BE**: Develop API endpoints for submitting and retrieving reviews.
    - **BE**: Implement a basic messaging API.
    - **FE**: Add the review section to therapist profiles and create the messaging interface.

7.  **Phase 7: Testing and Refinement (Completed)**
    - Write extensive `pytest` tests for the backend.
    - Conduct UI/UX testing and refine the user flow.
    - Perform end-to-end testing.

8.  **Phase 8: Deployment (Current Phase)**
    - Create a `compose.yaml` file for the backend, database, and mail server.
    - Build the frontend for production.
    - Configure the backend to serve the frontend.
    - Write a `Dockerfile` for the backend.
    - Write a `Dockerfile` for the frontend.

## 5. Deployment

- **Build Process**: The React frontend will be built into static artifacts.
- **Hosting**: The FastAPI backend will serve both the API and the static frontend artifacts.
- **Containerization**: The application will be containerized using Docker and orchestrated with `docker-compose` which will include the backend, a database, and a mail server.

## 6. Development Workflow

- **Version Control**: Git
- **Commit Strategy**: Commits will be made after each logical step or feature implementation is complete.