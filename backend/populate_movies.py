#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from movies.models import Movie, Genre, Person, Keyword

# Sample movies data
movies_data = [
    {
        'tmdb_id': 278,
        'title': 'The Shawshank Redemption',
        'overview': 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        'release_year': 1994,
        'runtime': 142,
        'vote_average': 9.3,
        'vote_count': 2345678,
        'popularity': 50.0,
        'original_language': 'en',
        'poster_path': 'https://example.com/shawshank.jpg',
    },
    {
        'tmdb_id': 238,
        'title': 'The Godfather',
        'overview': 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        'release_year': 1972,
        'runtime': 175,
        'vote_average': 9.2,
        'vote_count': 1234567,
        'popularity': 45.0,
        'original_language': 'en',
        'poster_path': 'https://example.com/godfather.jpg',
    },
    {
        'tmdb_id': 155,
        'title': 'The Dark Knight',
        'overview': 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        'release_year': 2008,
        'runtime': 152,
        'vote_average': 9.0,
        'vote_count': 2345678,
        'popularity': 60.0,
        'original_language': 'en',
        'poster_path': 'https://example.com/dark-knight.jpg',
    },
    {
        'tmdb_id': 680,
        'title': 'Pulp Fiction',
        'overview': 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        'release_year': 1994,
        'runtime': 154,
        'vote_average': 8.9,
        'vote_count': 1234567,
        'popularity': 40.0,
        'original_language': 'en',
        'poster_path': 'https://example.com/pulp-fiction.jpg',
    },
    {
        'tmdb_id': 13,
        'title': 'Forrest Gump',
        'overview': 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
        'release_year': 1994,
        'runtime': 142,
        'vote_average': 8.8,
        'vote_count': 1234567,
        'popularity': 35.0,
        'original_language': 'en',
        'poster_path': 'https://example.com/forrest-gump.jpg',
    }
]

def populate_movies():
    """Populate the database with sample movies"""
    print("Creating sample movies...")
    
    # Create some genres
    genres = ['Drama', 'Crime', 'Action', 'Adventure']
    genre_objects = []
    for genre_name in genres:
        genre, created = Genre.objects.get_or_create(name=genre_name)
        genre_objects.append(genre)
        if created:
            print(f"Created genre: {genre_name}")
    
    # Create some persons (actors/directors)
    persons = ['Frank Darabont', 'Tim Robbins', 'Morgan Freeman', 'Francis Ford Coppola', 'Marlon Brando', 'Al Pacino', 'Christopher Nolan', 'Christian Bale', 'Heath Ledger', 'Quentin Tarantino', 'John Travolta', 'Uma Thurman', 'Robert Zemeckis', 'Tom Hanks', 'Robin Wright']
    person_objects = []
    for person_name in persons:
        person, created = Person.objects.get_or_create(name=person_name)
        person_objects.append(person)
        if created:
            print(f"Created person: {person_name}")
    
    # Create movies
    for i, movie_data in enumerate(movies_data):
        movie, created = Movie.objects.get_or_create(
            tmdb_id=movie_data['tmdb_id'],
            defaults=movie_data
        )
        if created:
            print(f"Created movie: {movie.title}")
            # Add genres to the movie
            if i < len(genre_objects):
                movie.genres.add(genre_objects[i])
            # Add cast to the movie
            for j in range(min(3, len(person_objects))):
                movie.cast.add(person_objects[j])
            # Add directors to the movie
            if len(person_objects) > i:
                movie.directors.add(person_objects[i])
        else:
            print(f"Movie already exists: {movie.title}")
    
    print(f"Total movies in database: {Movie.objects.count()}")

if __name__ == '__main__':
    populate_movies()