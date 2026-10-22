from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Movie
from .serializers import MovieSerializer

class MoviePagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 100

class MovieViewSet(viewsets.ModelViewSet):
    """
    Optimized Movie ViewSet supporting high concurrency and millions of requests.
    Uses prefetch_related to eliminate N+1 queries and includes edge Cache-Control headers.
    """
    queryset = Movie.objects.prefetch_related('genres', 'cast', 'directors', 'keywords').all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
    pagination_class = MoviePagination

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # Enable caching at CDN/edge/browser level (2 minutes fresh, 10 minutes stale-while-revalidate)
        response['Cache-Control'] = 'public, max-age=120, stale-while-revalidate=600'
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        # Cache specific movie details for 5 minutes
        response['Cache-Control'] = 'public, max-age=300, stale-while-revalidate=1200'
        return response

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '').strip()
        queryset = self.get_queryset()
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) | 
                Q(overview__icontains=query)
            )
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response['Cache-Control'] = 'public, max-age=60, stale-while-revalidate=300'
            return response

        serializer = self.get_serializer(queryset[:24], many=True)
        response = Response(serializer.data)
        response['Cache-Control'] = 'public, max-age=60, stale-while-revalidate=300'
        return response

    @action(detail=False, methods=['get'])
    def trending(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response['Cache-Control'] = 'public, max-age=180, stale-while-revalidate=600'
            return response

        serializer = self.get_serializer(queryset[:24], many=True)
        response = Response(serializer.data)
        response['Cache-Control'] = 'public, max-age=180, stale-while-revalidate=600'
        return response