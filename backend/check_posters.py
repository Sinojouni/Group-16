#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from movies.models import Movie

def check_posters():
    """Check poster paths in the database"""
    print("Checking poster paths...")
    
    # Get total count
    total_movies = Movie.objects.count()
    print(f"Total movies: {total_movies}")
    
    # Check movies with empty poster paths
    empty_posters = Movie.objects.filter(poster_path__isnull=True) | Movie.objects.filter(poster_path='')
    print(f"Movies with empty poster paths: {empty_posters.count()}")
    
    # Check movies with poster paths
    movies_with_posters = Movie.objects.exclude(poster_path__isnull=True).exclude(poster_path='')
    print(f"Movies with poster paths: {movies_with_posters.count()}")
    
    # Show first 10 movies with poster paths
    if movies_with_posters.exists():
        print("\nFirst 10 movies with poster paths:")
        for movie in movies_with_posters[:10]:
            print(f"  - {movie.title} ({movie.release_year}): {movie.poster_path}")
    
    # Show first 10 movies without poster paths
    if empty_posters.exists():
        print("\nFirst 10 movies without poster paths:")
        for movie in empty_posters[:10]:
            print(f"  - {movie.title} ({movie.release_year})")

if __name__ == '__main__':
    check_posters()