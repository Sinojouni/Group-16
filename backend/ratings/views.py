import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Rating
from .serializers import RatingSerializer, UserRatingSerializer
from movies.models import Movie

class RatingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing, adding, and updating ratings and reviews.
    Unauthenticated users can read ratings/reviews.
    Authenticated users can rate movies and write reviews.
    """
    queryset = Rating.objects.select_related('user', 'movie').all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Rating.objects.select_related('user', 'movie').all().order_by('-updated_at')
        
        # Filter by movie
        movie_param = self.request.query_params.get('movie')
        if movie_param:
            try:
                uuid_obj = uuid.UUID(str(movie_param))
                queryset = queryset.filter(movie_id=uuid_obj)
            except (ValueError, AttributeError):
                if str(movie_param).isdigit():
                    queryset = queryset.filter(movie__tmdb_id=int(movie_param))
                else:
                    queryset = queryset.filter(movie__id=movie_param)

        # Filter by user
        user_param = self.request.query_params.get('user') or self.request.query_params.get('user_id')
        if user_param:
            try:
                user_uuid = uuid.UUID(str(user_param))
                queryset = queryset.filter(user_id=user_uuid)
            except (ValueError, AttributeError):
                queryset = queryset.filter(user_id=user_param)

        return queryset

    def create(self, request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication credentials were not provided.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        movie_param = request.data.get('movie') or request.data.get('movie_id')
        score = request.data.get('score')
        comment = request.data.get('comment', '')

        if movie_param is None:
            return Response({'movie': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        if score is None:
            return Response({'score': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        # Validate score range (0.5 to 5.0)
        try:
            score_val = float(score)
            if score_val < 0.5 or score_val > 5.0:
                return Response({'score': ['Score must be between 0.5 and 5.0.']}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'score': ['A valid number is required.']}, status=status.HTTP_400_BAD_REQUEST)

        # Resolve movie instance
        movie = None
        try:
            movie_uuid = uuid.UUID(str(movie_param))
            movie = Movie.objects.filter(id=movie_uuid).first()
        except (ValueError, AttributeError):
            pass

        if not movie and str(movie_param).isdigit():
            movie = Movie.objects.filter(tmdb_id=int(movie_param)).first()

        if not movie:
            movie = Movie.objects.filter(id=str(movie_param)).first()

        if not movie:
            return Response({'error': f'Movie with ID {movie_param} not found.'}, status=status.HTTP_404_NOT_FOUND)

        # update_or_create rating to honor unique_together = ('user', 'movie')
        rating, created = Rating.objects.update_or_create(
            user=request.user,
            movie=movie,
            defaults={
                'score': score_val,
                'comment': comment if comment is not None else '',
            }
        )

        serializer = self.get_serializer(rating)
        res_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=res_status)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Check permissions: only owner or staff can update
        if instance.user != request.user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to edit this rating.'}, status=status.HTTP_403_FORBIDDEN)

        score = request.data.get('score')
        if score is not None:
            try:
                score_val = float(score)
                if score_val < 0.5 or score_val > 5.0:
                    return Response({'score': ['Score must be between 0.5 and 5.0.']}, status=status.HTTP_400_BAD_REQUEST)
                instance.score = score_val
            except (ValueError, TypeError):
                return Response({'score': ['A valid number is required.']}, status=status.HTTP_400_BAD_REQUEST)

        if 'comment' in request.data:
            instance.comment = request.data.get('comment') or ''

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to delete this rating.'}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def user_ratings(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            ratings = Rating.objects.filter(user_id=user_id)
        elif request.user.is_authenticated:
            ratings = Rating.objects.filter(user=request.user)
        else:
            ratings = Rating.objects.none()
        
        serializer = UserRatingSerializer(ratings, many=True)
        return Response(serializer.data)