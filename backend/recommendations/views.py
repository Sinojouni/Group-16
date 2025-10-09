from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import requests
from django.conf import settings

from ratings.models import Rating
from movies.models import Movie
from movies.serializers import MovieSerializer

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_ratings = Rating.objects.filter(user=user)

        # Rule: User must have rated at least 5 movies
        if user_ratings.count() < 5:
            return Response(
                {"detail": "You need to rate at least 5 movies to get recommendations."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare payload for the model service
        ratings_payload = [
            {"movie_id": rating.movie.tmdb_id, "score": rating.score}
            for rating in user_ratings
        ]

        try:
            # Call the FastAPI model service
            response = requests.post(
                settings.MODEL_SERVICE_URL,
                json={"ratings": ratings_payload},
                timeout=10 # 10-second timeout
            )
            response.raise_for_status() # Raise an exception for 4xx or 5xx status codes
        
        except requests.exceptions.RequestException as e:
            # Handle network errors or errors from the model service
            return Response(
                {"error": "Could not retrieve recommendations at this time.", "detail": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Process the response from the model service
        recommended_movie_ids = response.json().get("recommendations", [])
        
        # Fetch full movie details from the Django database
        recommended_movies = Movie.objects.filter(tmdb_id__in=recommended_movie_ids)
        
        # To preserve the order from the model's recommendation
        movies_dict = {str(movie.tmdb_id): movie for movie in recommended_movies}
        ordered_movies = [movies_dict[str(tmdb_id)] for tmdb_id in recommended_movie_ids if str(tmdb_id) in movies_dict]

        serializer = MovieSerializer(ordered_movies, many=True)
        return Response(serializer.data)