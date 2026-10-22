#!/usr/bin/env python
import os
import sys
import django
from django.db import models

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from movies.models import Movie, Genre

def display_movies_by_genre():
    """Display all movies grouped by genre"""
    print("=" * 80)
    print("MOVIE DATABASE - ALL MOVIES BY GENRE")
    print("=" * 80)
    
    # Get all genres
    genres = Genre.objects.all().order_by('name')
    
    if not genres.exists():
        print("No genres found in the database.")
        return
    
    # Display movies for each genre
    for genre in genres:
        movies = genre.movies.all().order_by('-popularity', '-release_year')
        if movies.exists():
            print(f"\n.genre {genre.name.upper()} ({movies.count()} movies)")
            print("-" * 40)
            for movie in movies[:20]:  # Limit to 20 movies per genre to avoid overwhelming output
                rating = f"Rating: {movie.vote_average}/10" if movie.vote_average else "Rating: N/A"
                year = f"Year: {movie.release_year}" if movie.release_year else "Year: N/A"
                print(f"  • {movie.title} ({year}, {rating})")
        
    print("\n" + "=" * 80)

def display_all_movies():
    """Display all movies sorted by popularity"""
    print("=" * 80)
    print("MOVIE DATABASE - ALL MOVIES SORTED BY POPULARITY")
    print("=" * 80)
    
    movies = Movie.objects.all().order_by('-popularity', '-release_year')
    
    if not movies.exists():
        print("No movies found in the database.")
        return
    
    print(f"\nTOTAL MOVIES: {movies.count()}")
    print("-" * 80)
    
    for i, movie in enumerate(movies[:50], 1):  # Limit to 50 movies to avoid overwhelming output
        genres = ", ".join([g.name for g in movie.genres.all()])
        rating = f"Rating: {movie.vote_average}/10" if movie.vote_average else "Rating: N/A"
        year = f"Year: {movie.release_year}" if movie.release_year else "Year: N/A"
        print(f"{i:2d}. {movie.title}")
        print(f"    {year} | {rating} | Genres: {genres or 'N/A'}")
        print()

def display_genre_statistics():
    """Display statistics about genres"""
    print("=" * 80)
    print("MOVIE DATABASE - GENRE STATISTICS")
    print("=" * 80)
    
    # Correct way to get genres ordered by movie count
    genres = Genre.objects.annotate(movie_count=models.Count('movies')).order_by('-movie_count')
    
    if not genres.exists():
        print("No genres found in the database.")
        return
    
    print(f"\nTOTAL GENRES: {genres.count()}")
    print("-" * 40)
    
    for genre in genres:
        print(f"  • {genre.name}: {genre.movie_count} movies")

if __name__ == '__main__':
    print("Movie Database Display Script")
    print("=" * 80)
    
    # Display all information automatically
    display_genre_statistics()
    print("\n")
    display_movies_by_genre()
    print("\n")
    display_all_movies()