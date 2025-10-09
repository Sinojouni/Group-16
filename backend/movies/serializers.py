from rest_framework import serializers
from .models import Movie, Genre, Person, Keyword

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['name']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['name']

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['name']

class MovieSerializer(serializers.ModelSerializer):
    # Use StringRelatedField to show names instead of IDs for related fields
    genres = serializers.StringRelatedField(many=True)
    cast = serializers.StringRelatedField(many=True)
    directors = serializers.StringRelatedField(many=True)
    keywords = serializers.StringRelatedField(many=True)

    class Meta:
        model = Movie
        fields = [
            'id',
            'tmdb_id',
            'title',
            'overview',
            'release_year',
            'runtime',
            'vote_average',
            'vote_count',
            'popularity',
            'original_language',
            'poster_path',
            'genres',
            'cast',
            'directors',
            'keywords',
        ]