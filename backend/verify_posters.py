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

def verify_posters():
    """Verify that poster paths are correctly populated"""
    print("Verifying poster paths...")
    
    # Get total count
    total_movies = Movie.objects.count()
    print(f"Total movies: {total_movies}")
    
    # Check movies with empty poster paths
    empty_posters = Movie.objects.filter(poster_path__isnull=True) | Movie.objects.filter(poster_path='')
    print(f"Movies with empty poster paths: {empty_posters.count()}")
    
    # Check movies with poster paths
    movies_with_posters = Movie.objects.exclude(poster_path__isnull=True).exclude(poster_path='')
    print(f"Movies with poster paths: {movies_with_posters.count()}")
    
    # Show first 5 movies with poster paths
    if movies_with_posters.exists():
        print("\nFirst 5 movies with poster paths:")
        for movie in movies_with_posters[:5]:
            print(f"  - {movie.title} ({movie.release_year}): {movie.poster_path}")
    
    # Show first 5 movies without poster paths
    if empty_posters.exists():
        print("\nFirst 5 movies without poster paths:")
        for movie in empty_posters[:5]:
            print(f"  - {movie.title} ({movie.release_year})")
            
    # Check a specific movie
    movie = Movie.objects.first()
    if movie:
        print(f"\nSample movie details:")
        print(f"  Title: {movie.title}")
        print(f"  TMDB ID: {movie.tmdb_id}")
        print(f"  Poster path: {movie.poster_path}")
        print(f"  Genres: {[g.name for g in movie.genres.all()]}")

if __name__ == '__main__':
    verify_posters()