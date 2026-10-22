import pandas as pd
import ast
from django.core.management.base import BaseCommand
from django.db import transaction
from tqdm import tqdm
from movies.models import Movie, Genre, Person, Keyword

# A helper function to safely evaluate string representations of lists
def safe_literal_eval(val):
    if isinstance(val, str):
        try:
            return ast.literal_eval(val)
        except (ValueError, SyntaxError):
            return []
    return val if isinstance(val, list) else []

class Command(BaseCommand):
    help = 'Imports movie data from the pre-processed Kaggle dataset CSV.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the movie dataset CSV file.')

    @transaction.atomic
    def handle(self, *args, **options):
        csv_file_path = options['csv_file']
        self.stdout.write(self.style.SUCCESS(f'Starting movie import from "{csv_file_path}"...'))

        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Error: The file "{csv_file_path}" was not found.'))
            return

        # We only need unique movies for the import, not user ratings
        movies_df = df.drop_duplicates(subset=['tmdbId']).reset_index(drop=True)

        # Cache for related models to reduce database queries
        genre_cache = {genre.name: genre for genre in Genre.objects.all()}
        person_cache = {person.name: person for person in Person.objects.all()}
        keyword_cache = {keyword.name: keyword for keyword in Keyword.objects.all()}

        for _, row in tqdm(movies_df.iterrows(), total=movies_df.shape[0], desc="Importing Movies"):
            # Create or update the Movie instance
            movie, created = Movie.objects.update_or_create(
                tmdb_id=row['tmdbId'],
                defaults={
                    'title': row['title'],
                    'overview': row.get('overview', ''),
                    'release_year': int(row['release_year']) if pd.notna(row['release_year']) else None,
                    'runtime': int(row['runtime']) if pd.notna(row['runtime']) else None,
                    'vote_average': row.get('vote_average'),
                    'vote_count': int(row['vote_count']) if pd.notna(row['vote_count']) else None,
                    'popularity': row.get('popularity'),
                    'original_language': row.get('original_language'),
                    # Construct poster path using tmdbId
                    'poster_path': f"/{row['tmdbId']}.jpg" if pd.notna(row['tmdbId']) else '',
                }
            )

            # --- Handle Many-to-Many Relationships ---

            # Process Genres
            genre_names = safe_literal_eval(row.get('genres', '[]'))
            genre_objs = []
            for name in genre_names:
                if name not in genre_cache:
                    genre, _ = Genre.objects.get_or_create(name=name)
                    genre_cache[name] = genre
                genre_objs.append(genre_cache[name])
            movie.genres.set(genre_objs)

            # Process Cast (as Persons)
            cast_names = safe_literal_eval(row.get('cast', '[]'))
            cast_objs = []
            for name in cast_names:
                if name not in person_cache:
                    person, _ = Person.objects.get_or_create(name=name)
                    person_cache[name] = person
                cast_objs.append(person_cache[name])
            movie.cast.set(cast_objs)

            # Process Directors (as Persons)
            director_names = safe_literal_eval(row.get('director', '[]'))
            director_objs = []
            for name in director_names:
                if name not in person_cache:
                    person, _ = Person.objects.get_or_create(name=name)
                    person_cache[name] = person
                director_objs.append(person_cache[name])
            movie.directors.set(director_objs)

            # Process Keywords
            keyword_names = safe_literal_eval(row.get('keywords', '[]'))
            keyword_objs = []
            for name in keyword_names:
                if name not in keyword_cache:
                    keyword, _ = Keyword.objects.get_or_create(name=name)
                    keyword_cache[name] = keyword
                keyword_objs.append(keyword_cache[name])
            movie.keywords.set(keyword_objs)

        self.stdout.write(self.style.SUCCESS('Successfully imported all movie data.'))
