# **Movie Recommendation System \- Backend**

This repository contains the backend service for a movie recommendation application. It is built with Django and Django REST Framework, providing a robust API for user management, movie data, and ratings. The system is designed to work alongside a separate FastAPI service that will host the machine learning recommendation model.

## **Table of Contents**

* [Architecture Overview](https://www.google.com/search?q=%23architecture-overview)  
* [Features](https://www.google.com/search?q=%23features)  
* [Project Structure](https://www.google.com/search?q=%23project-structure)  
* [Setup and Installation](https://www.google.com/search?q=%23setup-and-installation)  
  * [Prerequisites](https://www.google.com/search?q=%23prerequisites)  
  * [Configuration](https://www.google.com/search?q=%23configuration)  
  * [Running the Application](https://www.google.com/search?q=%23running-the-application)  
  * [Importing Movie Data](https://www.google.com/search?q=%23importing-movie-data)  
* [Environment Variables](https://www.google.com/search?q=%23environment-variables)  
* [API Endpoints](https://www.google.com/search?q=%23api-endpoints)  
  * [Authentication](https://www.google.com/search?q=%23authentication)  
  * [Users](https://www.google.com/search?q=%23users)  
  * [Movies](https://www.google.com/search?q=%23movies)  
  * [Ratings](https://www.google.com/search?q=%23ratings)

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

backend/  
├── config/             \# Main project configuration (settings, urls)  
├── movies/             \# App for movie metadata and browsing  
│   └── management/  
│       └── commands/  
│           └── import\_movies.py \# Script to load movie data  
├── ratings/            \# App for user ratings  
├── users/              \# App for user management and authentication  
├── Dockerfile          \# Instructions to build the Django API image  
└── requirements.txt    \# Python dependencies  
docker-compose.yml      \# Defines and orchestrates all services (api, db, cache, worker)

## **Setup and Installation**

### **Prerequisites**

* [Docker](https://www.docker.com/get-started)  
* [Docker Compose](https://docs.docker.com/compose/install/)

### **Configuration**

1. **Clone the Repository:**  
   git clone \<your-repository-url\>  
   cd \<your-repository-folder\>

2. Create the Environment File:  
   Inside the backend/ directory, create a file named .env and copy the contents from the example below. Modify the values as needed for your setup.  
   \# .env file inside the 'backend' directory  
   DJANGO\_SECRET\_KEY="a-strong-and-unique-secret-key-for-your-project"  
   DJANGO\_DEBUG=True  
   DJANGO\_ALLOWED\_HOSTS=localhost,127.0.0.1

   \# Database Configuration (matches docker-compose.yml)  
   DATABASE\_URL=postgres://recomendationuser:recomendationpass@db:5432/recomendation

   \# Cache Configuration (matches docker-compose.yml)  
   REDIS\_URL=redis://cache:6379/0

   \# Frontend URL for constructing links in emails  
   FRONTEND\_URL=http://localhost:5173  
   CORS\_ALLOWED\_ORIGINS=http://localhost:5173,\[http://127.0.0.1:5173\](http://127.0.0.1:5173)

   \# Google OAuth2 Credentials  
   GOOGLE\_CLIENT\_ID="your-google-client-id.apps.googleusercontent.com"  
   GOOGLE\_CLIENT\_SECRET="your-google-client-secret"

   \# Email settings (console backend for development)  
   EMAIL\_BACKEND=django.core.mail.backends.console.EmailBackend

### **Running the Application**

1. Build and Start Services:  
   From the root directory (where docker-compose.yml is located), run:  
   docker-compose up \--build \-d

   This will build the Docker images and start the API, database, cache, and worker containers in the background.  
2. Apply Database Migrations:  
   Run the initial database migrations to create all the necessary tables.  
   docker-compose exec api python manage.py migrate

### **Importing Movie Data**

1. Place the Data File:  
   Put your cleaned movie dataset CSV file (e.g., sampled\_df.csv) inside the backend/ directory.  
2. Run the Import Command:  
   Execute the custom management command to load the movie data into the database. This may take several minutes depending on the file size.  
   docker-compose exec api python manage.py import\_movies sampled\_df.csv

The application should now be running and accessible at http://localhost:8000.

## **Environment Variables**

* DJANGO\_SECRET\_KEY: A secret key for a particular Django installation.  
* DJANGO\_DEBUG: Set to True for development (shows detailed errors), False for production.  
* DJANGO\_ALLOWED\_HOSTS: A comma-separated list of host/domain names that this Django site can serve.  
* DATABASE\_URL: The connection string for the PostgreSQL database.  
* REDIS\_URL: The connection string for the Redis cache and Celery broker.  
* FRONTEND\_URL: The base URL of your frontend application.  
* CORS\_ALLOWED\_ORIGINS: A comma-separated list of origins that are authorized to make cross-site HTTP requests.  
* GOOGLE\_CLIENT\_ID / GOOGLE\_CLIENT\_SECRET: Your credentials from Google Cloud Console for OAuth2.  
* EMAIL\_BACKEND: The backend to use for sending emails. console.EmailBackend is great for development as it prints emails to the terminal.

## **API Endpoints**

The API is versioned under /api/v1/. You can explore all endpoints interactively via the Swagger UI at:  
http://localhost:8000/api/schema/swagger-ui/

### **Authentication**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/auth/token/ | Log in with email/password. |
| POST | /api/v1/auth/token/refresh/ | Refresh the access token using a cookie. |
| POST | /api/v1/auth/logout/ | Log out and invalidate the refresh token. |
| POST | /api/v1/auth/oauth/google/ | Exchange Google auth code for JWT. |

### **Users**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/users/ | Register a new user. |
| GET | /api/v1/users/me/ | Get the profile of the current user. |
| PATCH | /api/v1/users/me/ | Update the profile of the current user. |
| POST | /api/v1/users/me/change-password/ | Change the current user's password. |

### **Movies**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/movies/ | Get a paginated list of all movies. Supports sorting via ?ordering= parameter (e.g., \-release\_year, popularity). |
| GET | /api/v1/movies/{tmdb\_id}/ | Get detailed metadata for a single movie. |

### **Ratings**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/ratings/ | Create a new rating or update an existing one. Requires authentication. **Body**: { "movie\_id": \<tmdb\_id\>, "score": \<float\> } |
| GET | /api/v1/ratings/me/ | Get a list of all ratings made by the current authenticated user. |