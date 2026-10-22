import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    django.setup()
    print("Django environment setup successfully")
    
    # Import models
    from movies.models import Movie, Genre
    
    # Check if we can access the models
    print(f"Total movies in database: {Movie.objects.count()}")
    print(f"Total genres in database: {Genre.objects.count()}")
    
    # Display some sample data if available
    if Movie.objects.exists():
        print("\nSample movies:")
        for movie in Movie.objects.all()[:5]:
            genres = [g.name for g in movie.genres.all()]
            print(f"- {movie.title} ({movie.release_year}) - Genres: {', '.join(genres) if genres else 'None'}")
    else:
        print("No movies found in database")
        
    if Genre.objects.exists():
        print("\nAll genres:")
        for genre in Genre.objects.all():
            movie_count = genre.movies.count()
            print(f"- {genre.name} ({movie_count} movies)")
    else:
        print("No genres found in database")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()