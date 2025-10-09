from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Rating, Movie
from .serializers import RatingSerializer, UserRatingSerializer

class RatingViewSet(mixins.CreateModelMixin,
                    mixins.UpdateModelMixin,
                    viewsets.GenericViewSet):
    """
    API endpoint for creating, updating, and viewing movie ratings.
    """
    queryset = Rating.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'my_ratings':
            return UserRatingSerializer
        return RatingSerializer

    def create(self, request, *args, **kwargs):
        """
        Create or update a rating for a movie.
        If a rating for this movie by this user already exists, it is updated.
        Otherwise, a new rating is created.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movie_id = serializer.validated_data['movie']['tmdb_id']
        score = serializer.validated_data['score']

        try:
            movie = Movie.objects.get(tmdb_id=movie_id)
        except Movie.DoesNotExist:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        # Use update_or_create to handle both new and existing ratings atomically
        rating, created = Rating.objects.update_or_create(
            user=request.user,
            movie=movie,
            defaults={'score': score}
        )

        action_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(UserRatingSerializer(rating).data, status=action_status)


    @action(detail=False, methods=['get'], url_path='me')
    def my_ratings(self, request):
        """
        Retrieve all ratings for the currently authenticated user.
        """
        user_ratings = Rating.objects.filter(user=request.user).select_related('movie')
        serializer = self.get_serializer(user_ratings, many=True)
        return Response(serializer.data)