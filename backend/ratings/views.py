from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Rating
from .serializers import RatingSerializer

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    @action(detail=False, methods=['get'])
    def user_ratings(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            ratings = Rating.objects.filter(user_id=user_id)
        else:
            ratings = Rating.objects.all()
        
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)