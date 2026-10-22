from django.urls import path
from .views import RecommendationView, PublicRecommendationView

app_name = 'recommendations'

urlpatterns = [
    path('recommendations/me/', RecommendationView.as_view(), name='user-recommendations'),
    path('recommendations/', PublicRecommendationView.as_view(), name='public-recommendations'),
    path('recommendations/featured/', PublicRecommendationView.as_view(), name='featured-recommendations'),
]