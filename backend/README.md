# AI-Powered Movie Recommendation System - Backend

## Overview
This is the backend API for the AI-Powered Movie and Book Recommendation System developed by Team Deep_Minds for the Samsung Innovation Campus AI Course Capstone Project.

## Features
- **User Management**: Create, read, update, and delete user accounts
- **Movie Database**: Comprehensive movie catalog with metadata
- **Rating System**: Users can rate movies on a 1-5 scale
- **AI Recommendations**: Multiple recommendation algorithms:
  - Content-based filtering (genre similarity)
  - Collaborative filtering (user-based & item-based)
  - Matrix factorization (SVD, NMF)
  - Hybrid approach
  - Popularity-based fallback
- **RESTful API**: Clean and well-documented API endpoints
- **Statistics Dashboard**: System-wide analytics and insights

## Tech Stack
- **Framework**: Flask 2.3.3
- **Database**: SQLite with SQLAlchemy ORM
- **ML Libraries**: scikit-learn, NumPy, pandas
- **Authentication**: Werkzeug password hashing
- **CORS**: Flask-CORS for cross-origin requests

## Project Structure
```
backend/
├── app.py                      # Main Flask application
├── models.py                   # Database models (User, Movie, Rating, Recommendation)
├── routes.py                   # API endpoints
├── config.py                   # Configuration settings
├── recommendation_engine.py    # AI recommendation logic
├── data_loader.py             # Utility to load MovieLens data
├── requirements.txt           # Python dependencies
├── .env.example              # Example environment variables
├── README.md                 # This file
└── models/                   # Directory for trained ML models
    └── (place your trained models here)
```

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup Steps

1. **Clone the repository** (or navigate to the backend directory)
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   ```bash
   copy .env.example .env
   ```
   Edit `.env` file with your configuration

6. **Initialize the database**
   ```bash
   python app.py
   ```
   This will create the SQLite database and tables automatically.

## Loading Data

### MovieLens Dataset

1. **Download MovieLens dataset**
   - Visit: https://grouplens.org/datasets/movielens/
   - Download MovieLens 100K or Latest-Small dataset
   - Extract the files

2. **Create data directory**
   ```bash
   mkdir data
   ```

3. **Copy CSV files**
   - Place `movies.csv` and `ratings.csv` in the `data/` directory

4. **Load data into database**
   ```bash
   python data_loader.py
   ```

## Running the Application

### Development Mode
```bash
python app.py
```
The API will be available at `http://localhost:5000`

### Production Mode
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### **Users**

- **Create User**
  ```
  POST /api/users
  Body: {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepass123",
    "age": 25,
    "gender": "M",
    "occupation": "Engineer"
  }
  ```

- **Get User**
  ```
  GET /api/users/<user_id>
  ```

- **Get All Users**
  ```
  GET /api/users?page=1&per_page=20
  ```

- **Update User**
  ```
  PUT /api/users/<user_id>
  Body: { "age": 26, "occupation": "Senior Engineer" }
  ```

- **Delete User**
  ```
  DELETE /api/users/<user_id>
  ```

#### **Movies**

- **Create Movie**
  ```
  POST /api/movies
  Body: {
    "movie_id": 1,
    "title": "Toy Story (1995)",
    "genres": "Animation|Children|Comedy",
    "release_year": 1995
  }
  ```

- **Get Movie**
  ```
  GET /api/movies/<movie_id>
  ```

- **Get All Movies**
  ```
  GET /api/movies?page=1&per_page=20&search=toy&genre=Comedy
  ```

- **Update Movie**
  ```
  PUT /api/movies/<movie_id>
  ```

- **Delete Movie**
  ```
  DELETE /api/movies/<movie_id>
  ```

#### **Ratings**

- **Create/Update Rating**
  ```
  POST /api/ratings
  Body: {
    "user_id": 1,
    "movie_id": 1,
    "rating": 4.5
  }
  ```

- **Get User Ratings**
  ```
  GET /api/ratings/user/<user_id>
  ```

- **Get Movie Ratings**
  ```
  GET /api/ratings/movie/<movie_id>
  ```

- **Delete Rating**
  ```
  DELETE /api/ratings/<rating_id>
  ```

#### **Recommendations**

- **Get Recommendations**
  ```
  GET /api/recommendations/<user_id>?n=10&algorithm=auto
  
  Algorithms: auto, content
  ```

- **Save Recommendations**
  ```
  POST /api/recommendations/save
  Body: {
    "user_id": 1,
    "recommendations": [
      {"movie_id": 5, "score": 0.95, "algorithm": "hybrid"},
      {"movie_id": 10, "score": 0.89, "algorithm": "hybrid"}
    ]
  }
  ```

- **Get Saved Recommendations**
  ```
  GET /api/recommendations/user/<user_id>/saved
  ```

#### **Statistics**

- **Get System Overview**
  ```
  GET /api/stats/overview
  ```

#### **Health Check**

- **Check API Status**
  ```
  GET /api/health
  ```

## Integrating Your Trained Model

After training your recommendation model, integrate it with the backend:

1. **Save your trained model**
   ```python
   import pickle
   
   # Save your model
   with open('models/hybrid_model.pkl', 'wb') as f:
       pickle.dump(your_trained_model, f)
   ```

2. **Update `recommendation_engine.py`**
   - Modify the `_get_model_recommendations()` method
   - Add your model's prediction logic
   - Example:
     ```python
     def _get_model_recommendations(self, user_id, n_recommendations):
         # Your model prediction code
         predictions = self.model.predict(user_id, all_movie_ids)
         # Sort and return top N recommendations
         return top_recommendations
     ```

3. **Load the model on startup**
   - The model will automatically load when the app starts
   - Place your model file in the `models/` directory

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email
- `password_hash`: Hashed password
- `age`, `gender`, `occupation`: User demographics
- `created_at`: Timestamp

### Movies Table
- `id`: Primary key
- `movie_id`: MovieLens ID
- `title`: Movie title
- `genres`: Pipe-separated genres
- `release_year`: Year of release
- `avg_rating`: Average rating
- `rating_count`: Number of ratings

### Ratings Table
- `id`: Primary key
- `user_id`: Foreign key to Users
- `movie_id`: Foreign key to Movies
- `rating`: Rating value (1-5)
- `timestamp`: When rated

### Recommendations Table
- `id`: Primary key
- `user_id`: Foreign key to Users
- `movie_id`: Foreign key to Movies
- `score`: Recommendation confidence
- `algorithm`: Algorithm used
- `created_at`: Timestamp

## Testing

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'

# Get recommendations
curl http://localhost:5000/api/recommendations/1?n=5
```

### Using Postman
Import the API endpoints into Postman and test each endpoint with sample data.

## Deployment

### PythonAnywhere Deployment

1. **Upload files** to PythonAnywhere
2. **Install dependencies** in virtual environment
3. **Configure WSGI file**:
   ```python
   import sys
   path = '/home/yourusername/backend'
   if path not in sys.path:
       sys.path.append(path)
   
   from app import create_app
   application = create_app('production')
   ```
4. **Set environment variables** in PythonAnywhere dashboard
5. **Reload web app**

## Team Members
- **Hadi Baghdadi** (Team Leader)
- **Hussein Jouni**
- **Faris Daas**

## Project Timeline
- **Phase 1**: Setup & Data Collection ✓
- **Phase 2**: Data Processing & Analysis
- **Phase 3**: Model Development
- **Phase 4**: System Development (Current)
- **Phase 5**: Testing & Deployment

## License
© 2023 Samsung Innovation Campus. All rights reserved.

## Support
For issues or questions, contact the development team.
