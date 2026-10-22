import urllib.request
import urllib.parse
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from django.core.management.base import BaseCommand
from movies.models import Movie

def fetch_omdb_poster(movie_id, title, release_year):
    try:
        clean_title = title.strip()
        encoded = urllib.parse.quote(clean_title)
        year_param = f"&y={release_year}" if release_year else ""
        url = f"https://www.omdbapi.com/?t={encoded}{year_param}&apikey=trilogy"
        req = urllib.request.Request(url, headers={'User-Agent': 'MovieRate/1.0'})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data.get('Response') == 'True':
                poster = data.get('Poster')
                if poster and poster.startswith('http'):
                    return movie_id, poster
        
        # Try without year if with year failed
        if year_param:
            url_no_year = f"https://www.omdbapi.com/?t={encoded}&apikey=trilogy"
            req2 = urllib.request.Request(url_no_year, headers={'User-Agent': 'MovieRate/1.0'})
            with urllib.request.urlopen(req2, timeout=4) as response:
                data = json.loads(response.read().decode('utf-8'))
                if data.get('Response') == 'True':
                    poster = data.get('Poster')
                    if poster and poster.startswith('http'):
                        return movie_id, poster
    except Exception:
        pass
    return movie_id, None

class Command(BaseCommand):
    help = 'Fetches authentic posters from OMDB for movies that lack an image.'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=300, help='Max movies to process in this run.')
        parser.add_argument('--workers', type=int, default=8, help='Number of parallel HTTP workers.')

    def handle(self, *args, **options):
        limit = options['limit']
        workers = options['workers']

        # Select movies that have placeholder or slash poster paths
        qs = Movie.objects.exclude(poster_path__startswith='http')[:limit]
        movies_data = [(m.id, m.title, m.release_year) for m in qs]
        total = len(movies_data)

        self.stdout.write(self.style.NOTICE(f'Found {total} movies to enrich with posters using {workers} workers...'))
        if total == 0:
            self.stdout.write(self.style.SUCCESS('All movies already have posters!'))
            return

        updated_count = 0
        with ThreadPoolExecutor(max_workers=workers) as executor:
            future_to_movie = {
                executor.submit(fetch_omdb_poster, m_id, title, year): (m_id, title)
                for m_id, title, year in movies_data
            }

            for future in as_completed(future_to_movie):
                m_id, title = future_to_movie[future]
                try:
                    _, poster_url = future.result()
                    if poster_url:
                        Movie.objects.filter(id=m_id).update(poster_path=poster_url)
                        updated_count += 1
                except Exception as e:
                    pass

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count}/{total} movie posters in the database!'))
