import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    django.setup()
    print("Django setup successful")
    
    # Try to import models
    from movies.models import Movie, Genre
    print("Models imported successfully")
    
    # Try to count objects
    movie_count = Movie.objects.count()
    genre_count = Genre.objects.count()
    print(f"Movie count: {movie_count}")
    print(f"Genre count: {genre_count}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()