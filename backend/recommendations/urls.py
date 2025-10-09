from django.urls import path
from .views import RecommendationView

app_name = 'recommendations'

urlpatterns = [
    path('recommendations/me/', RecommendationView.as_view(), name='user-recommendations'),
]