from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    """
    Serializer for creating or updating a movie rating.
    The user is inferred from the request, so it's not a required field here.
    """
    # Use the movie's tmdb_id for identification in the API.
    movie_id = serializers.IntegerField(source='movie.tmdb_id', write_only=True)

    class Meta:
        model = Rating
        fields = ['movie_id', 'score']
        extra_kwargs = {
            'score': {'validators': []}, # Use model's validators
        }


class UserRatingSerializer(serializers.ModelSerializer):
    """
    Serializer for listing the ratings made by a user.
    Includes nested movie information for context.
    """
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    tmdb_id = serializers.IntegerField(source='movie.tmdb_id', read_only=True)

    class Meta:
        model = Rating
        fields = ['tmdb_id', 'movie_title', 'score', 'updated_at']