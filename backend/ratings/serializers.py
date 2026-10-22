from rest_framework import serializers
from .models import Rating
from movies.models import Movie

class RatingSerializer(serializers.ModelSerializer):
    """
    Serializer for creating, updating, and viewing movie ratings and reviews.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    movie_id = serializers.CharField(source='movie.id', read_only=True)
    
    # Allow passing movie as UUID string or tmdb_id in write requests
    movie = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Rating
        fields = [
            'id',
            'user',
            'user_email',
            'username',
            'movie',
            'movie_id',
            'movie_title',
            'score',
            'comment',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'user_email', 'username', 'movie_id', 'movie_title', 'created_at', 'updated_at']
        extra_kwargs = {
            'score': {'validators': []},
            'comment': {'required': False, 'allow_blank': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure 'movie' field is also present on output as the movie UUID
        data['movie'] = str(instance.movie_id)
        data['user'] = str(instance.user_id)
        if 'comment' not in data or data['comment'] is None:
            data['comment'] = ''
        return data


class UserRatingSerializer(serializers.ModelSerializer):
    """
    Serializer for listing the ratings made by a user.
    Includes nested movie information for context.
    """
    movie_id = serializers.CharField(source='movie.id', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    tmdb_id = serializers.IntegerField(source='movie.tmdb_id', read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'movie_id', 'tmdb_id', 'movie_title', 'score', 'comment', 'created_at', 'updated_at']