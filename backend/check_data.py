#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from movies.models import Movie, Genre
from django.db import models

def check_database():
    """Check if data exists in the database"""
    print("Checking database contents...")
    
    # Count movies and genres
    movie_count = Movie.objects.count()
    genre_count = Genre.objects.count()
    
    print(f"Total movies: {movie_count}")
    print(f"Total genres: {genre_count}")
    
    if movie_count > 0:
        print("\nFirst 5 movies:")
        movies = Movie.objects.all()[:5]
        for movie in movies:
            genres = ", ".join([g.name for g in movie.genres.all()])
            print(f"  - {movie.title} ({movie.release_year}) - Genres: {genres}")
    
    if genre_count > 0:
        print("\nGenre statistics:")
        genres = Genre.objects.annotate(movie_count=models.Count('movies')).order_by('-movie_count')
        for genre in genres[:10]:  # Top 10 genres
            print(f"  - {genre.name}: {genre.movie_count} movies")

if __name__ == '__main__':
    check_database()