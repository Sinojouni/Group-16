# **Movie Recommendation System - Backend**

## 🎬 Overview
This is the backend API for a comprehensive movie recommendation system built with Django REST Framework. The system provides movie discovery, user ratings, personalized recommendations, and user management features.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Redis 6+
- Node.js 16+ (for frontend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Group-16-2/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Django Settings
   DJANGO_SECRET_KEY=your-secret-key-here
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

   # Database Settings
   DB_NAME=movie_recommendation
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432

   # Email Settings
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password

   # Redis Settings
   REDIS_URL=redis://localhost:6379/1
   CELERY_BROKER_URL=redis://localhost:6379/0
   CELERY_RESULT_BACKEND=redis://localhost:6379/0
   ```

5. **Set up database**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Load sample data (optional)**
   ```bash
   python manage.py import_movies
   ```

8. **Run the server**
   ```bash
   python manage.py runserver
   ```

## 📁 Project Structure

```
backend/
├── config/                 # Django project settings
│   ├── settings.py        # Main settings file
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI configuration
├── users/                 # User management app
│   ├── models.py         # User models
│   ├── views.py          # User views
│   ├── serializers.py    # User serializers
│   └── urls.py          # User URLs
├── movies/               # Movie management app
│   ├── models.py         # Movie models
│   ├── views.py          # Movie views
│   ├── serializers.py    # Movie serializers
│   └── urls.py          # Movie URLs
├── ratings/              # Rating system app
│   ├── models.py         # Rating models
│   ├── views.py          # Rating views
│   ├── serializers.py    # Rating serializers
│   └── urls.py          # Rating URLs
├── recommendations/      # Recommendation engine
│   ├── views.py          # Recommendation views
│   └── urls.py          # Recommendation URLs
└── requirements.txt      # Python dependencies
```

## 🔧 Configuration

### Django Settings
The main configuration is in `config/settings.py`. Key settings include:

- **Database**: PostgreSQL configuration
- **Authentication**: JWT + Django Allauth
- **CORS**: Configured for frontend integration
- **Cache**: Redis-based caching
- **Email**: SMTP configuration for user verification

### Apps Configuration
All Django apps are properly configured with `apps.py` files:

- ✅ `users` - User management and authentication
- ✅ `movies` - Movie catalog and management  
- ✅ `ratings` - User rating system
- ✅ `recommendations` - Recommendation engine

## 🛠️ Available Commands

### Django Management Commands
```bash
# Database operations
python manage.py makemigrations
python manage.py migrate
python manage.py makemigrations movies
python manage.py makemigrations ratings
python manage.py makemigrations users

# Data management
python manage.py import_movies
python manage.py createsuperuser
python manage.py collectstatic

# Development
python manage.py runserver
python manage.py shell
python manage.py check
```

### Testing
```bash
# Run tests
python manage.py test

# Test specific app
python manage.py test users
python manage.py test movies
python manage.py test ratings
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token

### Movies
- `GET /api/movies/` - List all movies
- `GET /api/movies/{id}/` - Get movie details
- `GET /api/movies/search/` - Search movies
- `GET /api/movies/genres/` - List genres

### Ratings
- `GET /api/ratings/` - User's ratings
- `POST /api/ratings/` - Create rating
- `PUT /api/ratings/{id}/` - Update rating
- `DELETE /api/ratings/{id}/` - Delete rating

### Recommendations
- `GET /api/recommendations/` - Get personalized recommendations
- `GET /api/recommendations/trending/` - Get trending movies

## 🐛 Troubleshooting

### Common Issues

1. **"No installed app with label 'movies'"**
   - ✅ **Fixed**: All apps are properly registered in `INSTALLED_APPS`
   - ✅ **Fixed**: All `apps.py` files are created and configured

2. **Deprecated allauth settings**
   - ✅ **Fixed**: Updated to use `ACCOUNT_LOGIN_METHODS` and `ACCOUNT_SIGNUP_FIELDS`

3. **Database connection issues**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Run migrations: `python manage.py migrate`

4. **Import errors**
   - Ensure virtual environment is activated
   - Install dependencies: `pip install -r requirements.txt`
   - Check Python path and Django settings

### Debug Mode
Enable debug mode by setting `DJANGO_DEBUG=True` in your `.env` file for detailed error messages.

## 🚀 Deployment

### Production Settings
For production deployment:

1. Set `DJANGO_DEBUG=False`
2. Configure proper `ALLOWED_HOSTS`
3. Use environment variables for sensitive data
4. Set up proper database and Redis instances
5. Configure static file serving
6. Set up SSL certificates

### Docker Deployment
Use the provided `Dockerfile` and `docker-compose.yml` for containerized deployment.

## 📊 Monitoring

### Logging
Logs are configured to write to:
- Console output (development)
- `logs/django.log` file (production)

### Health Checks
- Database: `python manage.py check --database default`
- Cache: `python manage.py check --deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ✅ Status

**All Django configuration issues have been resolved:**

- ✅ Django settings properly configured
- ✅ All apps registered and working
- ✅ Deprecated allauth settings updated
- ✅ Custom User model configured
- ✅ Database models properly defined
- ✅ Requirements.txt created
- ✅ Apps.py files created for all apps

**The backend is now ready for development and testing!**

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

```

## **Setup and Installation**

### **Prerequisites**

* [Docker](https://www.docker.com/get-started)  
* [Docker Compose](https://docs.docker.com/compose/install/)

### **Configuration**

1. **Clone the Repository:**  
   ```bash
   git clone <your-repository-url>
   cd <your-repository-folder>


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

1. **Download the Dataset:**
   The sample dataset is available here:
   [sampled_df.csv (Google Drive)](https://drive.google.com/file/d/1t2nYyr0bw-6JbrbMDOSDQfrrRF46qUyw/view?usp=drive_link)

   Download it manually and place it inside your `backend/` directory.

   ```
   backend/
   ├── sampled_df.csv
   ├── manage.py
   └── ...
   ```

2. **Run the Import Command:**

   ```bash
   docker-compose exec api python manage.py import_movies sampled_df.csv
   ```

   This loads the movie metadata into your PostgreSQL database.
   Depending on file size, it may take a few minutes.

The application should now be accessible at:
[http://localhost:8000](http://localhost:8000)

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

