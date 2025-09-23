from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.views import (
    UserViewSet,
    EmailVerificationView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    TokenObtainPairWithUserView,
    GoogleOAuthExchangeView,
    OAuthStateView,
    CookieTokenRefreshView,
    LogoutView,
    CSRFTokenView,
)

app_name = 'users'

# Register viewsets with the router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Authentication URLs
    path('auth/token/', TokenObtainPairWithUserView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/csrf/', CSRFTokenView.as_view(), name='csrf'),
    
    # Email verification
    path('auth/verify-email/', EmailVerificationView.as_view(), name='verify_email'),
    
    # Password reset
    path('auth/reset-password/', PasswordResetRequestView.as_view(), name='reset_password_request'),
    path('auth/reset-password/confirm/', PasswordResetConfirmView.as_view(), name='reset_password_confirm'),
    # Social OAuth exchanges
    path('auth/oauth/google/', GoogleOAuthExchangeView.as_view(), name='oauth_google'),
    path('auth/oauth/state/', OAuthStateView.as_view(), name='oauth_state'),
]
