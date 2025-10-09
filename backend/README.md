# **Movie Recommendation System - Backend**

This repository contains the backend service for a movie recommendation application. It is built with Django and Django REST Framework, providing a robust API for user management, movie data, and ratings. The system is designed to work alongside a separate FastAPI service that will host the machine learning recommendation model.

## **Table of Contents**

* [Architecture Overview](#architecture-overview)  
* [Features](#features)  
* [Project Structure](#project-structure)  
* [Setup and Installation](#setup-and-installation)  
  * [Prerequisites](#prerequisites)  
  * [Configuration](#configuration)  
  * [Running the Application](#running-the-application)  
  * [Importing Movie Data](#importing-movie-data)  
* [Environment Variables](#environment-variables)  
* [API Endpoints](#api-endpoints)  
  * [Authentication](#authentication)  
  * [Users](#users)  
  * [Movies](#movies)  
  * [Ratings](#ratings)

## **Architecture Overview**

The backend is composed of two main services (one implemented, one planned):

1. **Django API Service (This Repository):** A powerful backend responsible for:  
   * User registration, authentication, and profile management.  
   * Storing and serving movie metadata.  
   * Collecting and managing user ratings for movies.  
   * Securely handling all stateful operations and business logic.  

2. **FastAPI Model Service (Planned):** A high-performance, stateless service dedicated to:  
   * Wrapping the trained recommendation model.  
   * Providing an endpoint to generate movie recommendations for users.  
   * This service can be scaled independently to handle heavy inference loads.

## **Features**

* **Robust Authentication:** Secure token-based authentication using JWT with HttpOnly cookies for refresh tokens to prevent XSS attacks. Includes CSRF protection.  
* **User Management:** Full CRUD operations for users, email verification, and secure password reset functionality.  
* **Social Login:** OAuth2 integration for Google login.  
* **Movie Metadata API:** Endpoints to list all movies with pagination and sorting, and to retrieve detailed metadata for a specific movie.  
* **Rating System:** Allows authenticated users to create, update, and view their movie ratings (0.5 to 5.0).  
* **Interactive API Docs:** Automatic generation of a Swagger UI for easy testing and exploration of all endpoints.  
* **Containerized:** Fully containerized with Docker and Docker Compose for easy setup and consistent development/production environments.  
* **Asynchronous Tasks:** Uses Celery and Redis to handle background tasks like sending emails, ensuring fast API response times.  
* **Security:** Includes brute-force attack prevention (django-axes) and modern password hashing (Argon2).

## **Project Structure**

```

backend/
├── config/             # Main project configuration (settings, urls)
├── movies/             # App for movie metadata and browsing
│   └── management/
│       └── commands/
│           └── import_movies.py # Script to load movie data
├── ratings/            # App for user ratings
├── users/              # App for user management and authentication
├── Dockerfile          # Instructions to build the Django API image
└── requirements.txt    # Python dependencies
docker-compose.yml      # Defines and orchestrates all services (api, db, cache, worker)

````

## **Setup and Installation**

### **Prerequisites**

* [Docker](https://www.docker.com/get-started)  
* [Docker Compose](https://docs.docker.com/compose/install/)

### **Configuration**

1. **Clone the Repository:**  
   ```bash
   git clone <your-repository-url>
   cd <your-repository-folder>
````

2. **Create the Environment File:**
   Inside the backend/ directory, create a file named `.env` and copy the contents from the example below. Modify the values as needed for your setup.

   ```bash
   # .env file inside the 'backend' directory
   DJANGO_SECRET_KEY="a-strong-and-unique-secret-key-for-your-project"
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

   # Database Configuration (matches docker-compose.yml)
   DATABASE_URL=postgres://recomendationuser:recomendationpass@db:5432/recomendation

   # Cache Configuration (matches docker-compose.yml)
   REDIS_URL=redis://cache:6379/0

   # Frontend URL for constructing links in emails
   FRONTEND_URL=http://localhost:5173
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

   # Google OAuth2 Credentials
   GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email settings (console backend for development)
   EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
````

### **Running the Application**

1. **Build and Start Services:**
   From the root directory (where `docker-compose.yml` is located), run:

   ```bash
   docker-compose up --build -d
   ```

   This will build the Docker images and start the API, database, cache, and worker containers in the background.

2. **Apply Database Migrations:**
   Run the initial database migrations to create all the necessary tables.

   ```bash
   docker-compose exec api python manage.py migrate
   ```

### **Importing Movie Data**

1. **Place the Data File:**
   Put your cleaned movie dataset CSV file (e.g., `sampled_df.csv`) inside the `backend/` directory.

2. **Run the Import Command:**
   Execute the custom management command to load the movie data into the database.

   ```bash
   docker-compose exec api python manage.py import_movies sampled_df.csv
   ```

The application should now be running and accessible at [http://localhost:8000](http://localhost:8000).

## **Environment Variables**

| Variable                                    | Description                                                                |
| :------------------------------------------ | :------------------------------------------------------------------------- |
| `DJANGO_SECRET_KEY`                         | A secret key for a particular Django installation.                         |
| `DJANGO_DEBUG`                              | Set to True for development (shows detailed errors), False for production. |
| `DJANGO_ALLOWED_HOSTS`                      | A comma-separated list of allowed hosts.                                   |
| `DATABASE_URL`                              | The PostgreSQL connection string.                                          |
| `REDIS_URL`                                 | The Redis connection string (for Celery broker).                           |
| `FRONTEND_URL`                              | The base URL of your frontend app.                                         |
| `CORS_ALLOWED_ORIGINS`                      | A comma-separated list of allowed frontend origins.                        |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth2 credentials from Google Cloud Console.                              |
| `EMAIL_BACKEND`                             | The backend used for sending emails (console backend for development).     |

## **API Endpoints**

The API is versioned under `/api/v1/`.
Interactive Swagger UI available at:
[http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)

### **Authentication**

| Method | Endpoint                    | Description                               |
| :----- | :-------------------------- | :---------------------------------------- |
| POST   | /api/v1/auth/token/         | Log in with email/password.               |
| POST   | /api/v1/auth/token/refresh/ | Refresh the access token using a cookie.  |
| POST   | /api/v1/auth/logout/        | Log out and invalidate the refresh token. |
| POST   | /api/v1/auth/oauth/google/  | Exchange Google auth code for JWT.        |

### **Users**

| Method | Endpoint                          | Description                             |
| :----- | :-------------------------------- | :-------------------------------------- |
| POST   | /api/v1/users/                    | Register a new user.                    |
| GET    | /api/v1/users/me/                 | Get the profile of the current user.    |
| PATCH  | /api/v1/users/me/                 | Update the profile of the current user. |
| POST   | /api/v1/users/me/change-password/ | Change the current user's password.     |

### **Movies**

| Method | Endpoint                  | Description                                                                                                            |
| :----- | :------------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| GET    | /api/v1/movies/           | Get a paginated list of all movies. Supports sorting via `?ordering=` parameter (e.g., `-release_year`, `popularity`). |
| GET    | /api/v1/movies/{tmdb_id}/ | Get detailed metadata for a single movie.                                                                              |

### **Ratings**

| Method | Endpoint            | Description                                                                        |
| :----- | :------------------ | :--------------------------------------------------------------------------------- |
| POST   | /api/v1/ratings/    | Create or update a rating. **Body:** `{ "movie_id": <tmdb_id>, "score": <float> }` |
| GET    | /api/v1/ratings/me/ | Get all ratings made by the current user.                                          |

```
