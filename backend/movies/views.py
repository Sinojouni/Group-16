from rest_framework import viewsets, permissions
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Movie
from .serializers import MovieSerializer

class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class for the movie list endpoint.
    Allows clients to specify page size.
    """
    page_size = 20  # Default number of items per page
    page_size_query_param = 'page_size'
    max_page_size = 100 # Maximum page size a client can request

class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows movies to be viewed.

    Provides `list` (all movies, paginated) and `detail` (single movie) actions.

    The list endpoint at `/api/v1/movies/` supports sorting. Use the `ordering` query parameter with one of the following options:
    - `popularity` (most popular first)
    - `-popularity` (least popular first)
    - `release_year` (newest first)
    - `-release_year` (oldest first)
    - `vote_average` (highest rated first)
    - `-vote_average` (lowest rated first)
    - `vote_count` (most votes first)
    - `-vote_count` (least votes first)

    Example: `/api/v1/movies/?ordering=-release_year`
    """
    queryset = Movie.objects.all().prefetch_related(
        'genres', 'cast', 'directors', 'keywords'
    )
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "tmdb_id"

    # --- New Additions ---
    # Add Filtering and Ordering Backends
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    pagination_class = StandardResultsSetPagination

    # Define the fields the API can be sorted by
    ordering_fields = ['release_year', 'popularity', 'vote_average', 'vote_count']

    # Set a default ordering so results are consistent
    ordering = ['-popularity']