
# Project Plan: Yelp for Therapists

## 1. Project Overview

- **Project Name**: Yelp for Therapists
- **Mission**: To create a trusted and easy-to-use platform that connects individuals seeking mental health support with qualified local therapists. The platform will facilitate discovery, booking, and communication in a secure and confidential manner.

## 2. Core Features

- **Advanced Therapist Search**: Patients can search for therapists using location-based queries (powered by OpenStreetMap) and filter results by specialization, availability, price range, and patient reviews.
- **Comprehensive Therapist Profiles**: Therapists can create detailed profiles showcasing their qualifications, experience, specializations, office photos, and a personal bio to connect with potential patients.
- **Seamless Appointment Management**: An integrated calendar system allows patients to view a therapist's real-time availability and book appointments directly. Both parties can manage their schedules through a personal dashboard.
- **Verified Patient Reviews**: Patients can leave ratings and detailed reviews after a completed appointment, building a transparent and community-driven reputation system.
- **Secure Messaging Portal**: A confidential, in-app messaging system for patients and therapists to communicate securely before and after appointments.
- **User Authentication**: Separate, secure registration and login flows for Patients and Therapists.

## 3. Technology Stack

### Frontend

- **Language**: **TypeScript** (for type safety and scalability)
- **Framework**: **React** (using Vite for a fast development experience)
- **Styling**: **SCSS** (for advanced and organized styling)
- **UI Library**: **MUI (Material-UI) for React** which implements Google's Material 3 design principles.
- **Mapping**: **OpenStreetMap** integrated with a library like **Leaflet** or **React-Leaflet** for displaying therapist locations.
- **State Management**: **Redux Toolkit** for predictable and centralized state management.
- **Routing**: **React Router** for client-side navigation.

### Backend

- **Language**: **Python**
- **Framework**: **FastAPI** (for its high performance, automatic data validation, and interactive API documentation).
- **Database**: **PostgreSQL** (a robust relational database that handles complex queries and geospatial data well). We will use a local **SQLite** database for development.
- **ORM**: **SQLAlchemy** (using the modern, fully typed 2.0 syntax with `Mapped` and `mapped_column`).
- **Type Safety**: **MyPy** configured for strict type checking across the entire backend.
- **Data Validation**: **Pydantic** (integrated natively in FastAPI for request and response model validation).
- **API Testing**: **Pytest** with `requests` or `httpx` to write comprehensive unit and integration tests for all API endpoints.
- **Authentication**: JWT (JSON Web Tokens) for securing API endpoints.

## 4. Development Strategy

1.  **Phase 1: Backend Foundation**
    - Initialize the FastAPI project structure.
    - Define the database schema using SQLAlchemy models.
    - Implement user registration and JWT-based authentication for both Patients and Therapists.
    - Create CRUD API endpoints for therapist profile management.

2.  **Phase 2: Frontend Scaffolding**
    - Set up the React + TypeScript project using Vite.
    - Configure SCSS and install MUI (Material-UI).
    - Implement the main application layout, routing, and navigation.
    - Build the registration and login pages and connect them to the backend authentication endpoints.

3.  **Phase 3: Core Feature Implementation (Search & Profiles)**
    - **BE**: Develop the therapist search API endpoint with filtering logic.
    - **FE**: Build the therapist search page with map view (OpenStreetMap) and filter components.
    - **FE**: Create the component for displaying detailed therapist profiles.

4.  **Phase 4: Appointment Booking**
    - **BE**: Create API endpoints for managing availability and booking appointments.
    - **FE**: Implement the therapist availability calendar on the profile page.
    - **FE**: Build the appointment booking flow and the user dashboard for managing appointments.

5.  **Phase 5: Reviews & Messaging**
    - **BE**: Develop API endpoints for submitting and retrieving reviews.
    - **BE**: Implement a basic WebSocket or long-polling-based messaging API.
    - **FE**: Add the review section to therapist profiles and create the secure messaging interface.

6.  **Phase 6: Testing and Refinement**
    - **BE**: Write extensive `pytest` tests to ensure all API endpoints are working correctly and handle edge cases.
    - **FE**: Conduct UI/UX testing and refine the user flow.
    - Perform end-to-end testing of the entire application.

7.  **Phase 7: Deployment**
    - Containerize the frontend and backend applications using Docker.
    - Plan for deployment on a cloud provider like AWS, Google Cloud, or Heroku.

## 5. Development Workflow

- **Version Control**: Git
- **Commit Strategy**: Commits will be made after each logical step or feature implementation is complete to ensure a clean and traceable project history.
