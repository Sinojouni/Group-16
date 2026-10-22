from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Movie
from .serializers import MovieSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]  # Allow public access to movies

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            movies = Movie.objects.filter(
                Q(title__icontains=query) | 
                Q(description__icontains=query)
            )
        else:
            movies = Movie.objects.all()
        
        serializer = self.get_serializer(movies, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        movies = Movie.objects.all()[:10]  # أول 10 أفلام
        serializer = self.get_serializer(movies, many=True)
        return Response(serializer.data)