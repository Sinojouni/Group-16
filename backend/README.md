Movie Recommendation System - Backend
This repository contains the backend service for a movie recommendation application. It is built with Django and Django REST Framework, providing a robust API for user management, movie data, and ratings. The system is designed to work alongside a separate FastAPI service that will host the machine learning recommendation model.

Table of Contents
Architecture Overview

Features

Project Structure

Setup and Installation

Prerequisites

Configuration

Running the Application

Importing Movie Data

Environment Variables

API Endpoints

Authentication

Users

Movies

Ratings

Architecture Overview
The backend is composed of two main services (one implemented, one planned):

Django API Service (This Repository): A powerful backend responsible for:

User registration, authentication, and profile management.

Storing and serving movie metadata.

Collecting and managing user ratings for movies.

Securely handling all stateful operations and business logic.

FastAPI Model Service (Planned): A high-performance, stateless service dedicated to:

Wrapping the trained recommendation model.

Providing an endpoint to generate movie recommendations for users.

This service can be scaled independently to handle heavy inference loads.

Features
Robust Authentication: Secure token-based authentication using JWT with HttpOnly cookies for refresh tokens to prevent XSS attacks. Includes CSRF protection.

User Management: Full CRUD operations for users, email verification, and secure password reset functionality.

Social Login: OAuth2 integration for Google login.

Movie Metadata API: Endpoints to list all movies with pagination and sorting, and to retrieve detailed metadata for a specific movie.

Rating System: Allows authenticated users to create, update, and view their movie ratings (0.5 to 5.0).

Interactive API Docs: Automatic generation of a Swagger UI for easy testing and exploration of all endpoints.

Containerized: Fully containerized with Docker and Docker Compose for easy setup and consistent development/production environments.

Asynchronous Tasks: Uses Celery and Redis to handle background tasks like sending emails, ensuring fast API response times.

Security: Includes brute-force attack prevention (django-axes) and modern password hashing (Argon2).

Project Structure
.
├── backend/
│   ├── config/             # Main project configuration (settings, urls)
│   ├── movies/             # App for movie metadata and browsing
│   │   └── management/
│   │       └── commands/
│   │           └── import_movies.py # Script to load movie data
│   ├── ratings/            # App for user ratings
│   ├── users/              # App for user management and authentication
│   ├── .env                # Local environment variables (you create this)
│   ├── Dockerfile          # Instructions to build the Django API image
│   └── requirements.txt    # Python dependencies
└── docker-compose.yml      # Defines and orchestrates all services (api, db, cache, worker)

Setup and Installation
Prerequisites
Docker

Docker Compose

Configuration
Clone the Repository:

git clone <your-repository-url>
cd <your-repository-folder>

Create the Environment File:
Inside the backend/ directory, create a file named .env and copy the contents from the example below. Modify the values as needed for your setup.

# .env file inside the 'backend' directory
# --- Core Django Settings ---
DJANGO_SECRET_KEY="a-strong-and-unique-secret-key-for-your-project"
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# --- Database Configuration (matches docker-compose.yml) ---
DATABASE_URL=postgres://recomendationuser:recomendationpass@db:5432/recomendation

# --- Cache Configuration (matches docker-compose.yml) ---
REDIS_URL=redis://cache:6379/0

# --- Application URLs ---
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,[http://127.0.0.1:5173](http://127.0.0.1:5173)

# --- Google OAuth2 Credentials ---
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# --- Email Settings ---
# For development, 'console.EmailBackend' prints emails to the terminal.
# For production, use 'django.core.mail.backends.smtp.EmailBackend' and fill in the details below.
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-password

# --- Security & Throttling (optional) ---
API_RATE_LIMIT_ANON=100/hour
API_RATE_LIMIT_USER=1000/hour
CSRF_COOKIE_SECURE=False
SESSION_COOKIE_SECURE=False
SECURE_SSL_REDIRECT=False

Running the Application
Build and Start Services:
From the root directory (where docker-compose.yml is located), run:

docker-compose up --build -d

This will build the Docker images and start the API, database, cache, and worker containers in the background.

Apply Database Migrations:
Run the initial database migrations to create all the necessary tables.

docker-compose exec api python manage.py migrate

Importing Movie Data
Place the Data File:
Put your cleaned movie dataset CSV file (e.g., sampled_df.csv) inside the backend/ directory.

Run the Import Command:
Execute the custom management command to load the movie data into the database. This may take several minutes depending on the file size.

docker-compose exec api python manage.py import_movies sampled_df.csv

The application should now be running and accessible at http://localhost:8000.

API Endpoints
The API is versioned under /api/v1/. You can explore all endpoints interactively via the Swagger UI at:
http://localhost:8000/api/schema/swagger-ui/

Authentication
Method

Endpoint

Description

POST

/auth/token/

Log in with email/password.

POST

/auth/token/refresh/

Refresh the access token using a cookie.

POST

/auth/logout/

Log out and invalidate the refresh token.

POST

/auth/oauth/google/

Exchange Google auth code for JWT.

Users
Method

Endpoint

Description

POST

/users/

Register a new user.

GET

/users/me/

Get the profile of the current user.

PATCH

/users/me/

Update the profile of the current user.

POST

/users/me/change-password/

Change the current user's password.

POST

/users/me/resend-verification/

Resend the email verification link.

Movies
Method

Endpoint

Description

GET

/movies/

Get a paginated list of movies. Supports sorting via ?ordering= (e.g., -release_year, -popularity).

GET

/movies/{tmdb_id}/

Get detailed metadata for a single movie.

Ratings
Method

Endpoint

Description

POST

/ratings/

Create or update a rating. Body: { "movie_id": <tmdb_id>, "score": <float> }

GET

/ratings/me/

Get all ratings made by the current user.