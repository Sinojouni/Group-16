from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from datetime import timedelta
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
import requests
from django.contrib.auth import update_session_auth_hash
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.throttling import SimpleRateThrottle
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
import uuid
from django.core import signing
from django.core.cache import cache

from users.throttling import PasswordResetRequestThrottle

from users.models import EmailVerificationToken as EmailVerification
from users.models import PasswordResetToken as PasswordReset
from users.serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer,
    EmailVerificationSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    TokenObtainPairWithUserSerializer
)
from users.services import (
    send_verification_email,
    send_password_reset_email
)
from users.permissions import IsSelfOrAdmin

User = get_user_model()

def set_refresh_cookie(response: Response, refresh_token: str):
    """Apply secure HttpOnly refresh cookie settings."""
    response.set_cookie(
        "refresh_token",
        refresh_token,
        max_age=int(settings.SIMPLE_JWT.get("REFRESH_TOKEN_LIFETIME").total_seconds()),
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        path="/api/v1/auth/token/refresh/",
    )
    return response

class RefreshTokenThrottle(SimpleRateThrottle):
    scope = 'refresh'
    def get_cache_key(self, request, view):  # pragma: no cover
        return self.get_ident(request)


class UserViewSet(viewsets.ModelViewSet):
    """
    Viewset for user management.
    """
    queryset = User.objects.all()
    lookup_field = "id"

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.AllowAny()]
        if self.action in ["list", "destroy"]:
            return [permissions.IsAdminUser()]
        if self.action in ["retrieve", "update", "partial_update", "change_password"]:
            return [permissions.IsAuthenticated(), IsSelfOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        if self.action in ["partial_update", "update"]:
            return UserUpdateSerializer
        return UserSerializer

    def get_queryset(self):
        if self.action == "list":
            return User.objects.only(
                "id","email","username","first_name","last_name","is_email_verified","created_at","updated_at"
            )
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(UserSerializer(instance).data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        Register a new user with email verification.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        with transaction.atomic():
            EmailVerification.objects.filter(user=user, is_used=False).update(is_used=True)
            verification = EmailVerification.objects.create(
                user=user,
                expires_at=timezone.now() + timedelta(hours=1)
            )
            send_verification_email(user, verification.token)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    @extend_schema(
        description="Retrieve or update the currently authenticated user.",
        responses={200: UserSerializer},
    )
    @action(
        detail=False,
        methods=['get', 'patch'],
        url_path='me',
        permission_classes=[permissions.IsAuthenticated]
    )
    def me(self, request):
        if request.method.lower() == 'get':
            return Response(UserSerializer(request.user).data)
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)

    @extend_schema(
        request=ChangePasswordSerializer,
        responses={200: OpenApiResponse(description="Password changed successfully")}
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='me/change-password',
        serializer_class=ChangePasswordSerializer,
        permission_classes=[permissions.IsAuthenticated]
    )
    def change_password_me(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(user=request.user)
        update_session_auth_hash(request, instance)
        return Response({"detail": "Password changed."})

    @extend_schema(
        responses={200: OpenApiResponse(description="Verification email sent")}
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='me/resend-verification',
        permission_classes=[permissions.IsAuthenticated]
    )
    def resend_verification_me(self, request):
        user = request.user
        if user.is_email_verified:
            return Response({'detail': 'Email is already verified'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            EmailVerification.objects.filter(user=user, is_used=False).update(is_used=True)
            verification = EmailVerification.objects.create(
                user=user,
                expires_at=timezone.now() + timedelta(hours=1)
            )
            send_verification_email(user, verification.token)
        return Response({'detail': 'Verification email sent'}, status=status.HTTP_200_OK)
    
    @extend_schema(
        request=ChangePasswordSerializer,
        responses={
            200: OpenApiResponse(description="Password changed successfully"),
            400: OpenApiResponse(description="Invalid input")
        }
    )
    @action(
        detail=True,
        methods=['post'],
        serializer_class=ChangePasswordSerializer,
        permission_classes=[permissions.IsAuthenticated, IsSelfOrAdmin]
    )
    def change_password(self, request, id=None):
        """
        Change the user's password.
        """
        user = self.get_object()
        self.check_object_permissions(request, user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response({"detail": "Password changed."})
    
    


class EmailVerificationView(APIView):
    """
    Verify a user's email address.
    """
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        request=EmailVerificationSerializer,
        responses={
            200: OpenApiResponse(description="Email verified successfully"),
            400: OpenApiResponse(description="Invalid token")
        }
    )
    def post(self, request):
        with transaction.atomic():
            serializer = EmailVerificationSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            token_obj = serializer.validated_data["verification_obj"]

            if not token_obj.is_valid():
                return Response({"detail": "Invalid or expired token"}, status=400)
            user = token_obj.user
            if not user.is_email_verified:
                user.is_email_verified = True
                user.save(update_fields=["is_email_verified", "updated_at"])
            token_obj.is_used = True
            token_obj.save(update_fields=["is_used"])

        return Response({"detail": "Email verified."})


class PasswordResetRequestView(APIView):
    """
    Request a password reset.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetRequestThrottle]
    
    @extend_schema(
        request=PasswordResetRequestSerializer,
        responses={
            200: OpenApiResponse(description="Password reset email sent if email exists")
        }
    )
    def post(self, request):
        """
        Send a password reset email to the user.
        """
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            
            with transaction.atomic():
                PasswordReset.objects.filter(user=user, is_used=False).update(is_used=True)
                expires_at = timezone.now() + timedelta(hours=1)
                reset = PasswordReset.objects.create(
                    user=user,
                    expires_at=expires_at
                )
                
                send_password_reset_email(user, reset.token)
                
        except User.DoesNotExist:
            pass
        
        return Response(
            {'detail': 'Password reset email sent if the email is registered'},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """
    Confirm a password reset.
    """
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        request=PasswordResetConfirmSerializer,
        responses={
            200: OpenApiResponse(description="Password reset successful"),
            400: OpenApiResponse(description="Invalid token or passwords")
        }
    )
    def post(self, request):
        """
        Reset a user's password with the provided token.
        """
        with transaction.atomic():
            serializer = PasswordResetConfirmSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        
        return Response(
            {'detail': 'Password reset successful'},
            status=status.HTTP_200_OK
        )


class TokenObtainPairWithUserView(TokenObtainPairView):
    """
    Takes a set of user credentials and returns an access and refresh JSON web
    token pair along with user data to prove the authentication of those credentials.
    """
    serializer_class = TokenObtainPairWithUserSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data
        refresh = data.pop("refresh", None)
        if refresh:
            set_refresh_cookie(response, refresh)
        return response


@method_decorator(csrf_protect, name="dispatch")
class CookieTokenRefreshView(APIView):
    """Refresh access token using refresh token stored in HttpOnly cookie.

    Applies CSRF protection. Client must include valid CSRF token (Django standard) when calling.
    """
    permission_classes = [AllowAny]
    throttle_classes = [RefreshTokenThrottle]

    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token")
        if not raw_refresh:
            return Response({"detail": "No refresh cookie"}, status=401)
        try:
            old_refresh = RefreshToken(raw_refresh)
        except Exception:
            return Response({"detail": "Invalid refresh"}, status=401)

        user_id_claim = settings.SIMPLE_JWT.get("USER_ID_CLAIM", "user_id")
        user_id_field = settings.SIMPLE_JWT.get("USER_ID_FIELD", "id")
        user_id = old_refresh.get(user_id_claim)
        if not user_id:
            return Response({"detail": "Invalid token payload"}, status=401)
        try:
            user = User.objects.get(**{user_id_field: user_id})
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=401)

        rotate = settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False)
        blacklist_after = settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION", False)
        new_refresh = old_refresh
        if rotate:
            if blacklist_after and 'rest_framework_simplejwt.token_blacklist' in settings.INSTALLED_APPS:
                try:
                    old_refresh.blacklist()
                except Exception:
                    pass
            new_refresh = RefreshToken.for_user(user)

        access = str(new_refresh.access_token)
        resp = Response({"access": access, "user": UserSerializer(user).data})
        set_refresh_cookie(resp, str(new_refresh))
        return resp


class LogoutView(APIView):
    """Invalidate refresh token cookie (and blacklist if enabled)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token")
        if raw_refresh:
            try:
                tok = RefreshToken(raw_refresh)
                if settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION", False):
                    tok.blacklist()
            except Exception:
                pass
        resp = Response({"detail": "Logged out"})
        resp.delete_cookie("refresh_token", path="/api/v1/auth/token/refresh/")
        return resp


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFTokenView(APIView):
    """Return 200 and ensure csrftoken cookie is set by middleware."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = [] 

    def get(self, request):
        token = request.META.get('CSRF_COOKIE')
        return Response({"detail": "CSRF cookie set", "csrfToken": token}, status=200)



STATE_CACHE_PREFIX = "oauth_state:"
STATE_TTL_SECONDS = 300 


@extend_schema(
    description="Issue a one-time signed state token for OAuth initiation. Pass ?provider=google",
    responses={200: OpenApiResponse(description="State token returned")},
)
class OAuthStateView(APIView):
    permission_classes = [permissions.AllowAny]
    ALLOWED_PROVIDERS = {"google"}

    def get(self, request):
        provider = request.query_params.get("provider")
        if provider not in self.ALLOWED_PROVIDERS:
            return Response({"detail": "Invalid or missing provider"}, status=400)
        raw = f"{provider}:{uuid.uuid4()}"
        signed = signing.dumps({"v": raw})
        cache.set(STATE_CACHE_PREFIX + raw, True, timeout=STATE_TTL_SECONDS)
        return Response({"state": signed, "expires_in": STATE_TTL_SECONDS})


@extend_schema(
    description="Exchange Google OAuth authorization code for JWT tokens (supports PKCE via code_verifier).",
    request=None,
    responses={200: OpenApiResponse(description="Tokens returned with user payload")},
)
def _validate_oauth_state(signed_state: str, provider: str) -> bool:
    try:
        data = signing.loads(signed_state)
        raw = data.get("v")
        if not raw or not raw.startswith(f"{provider}:"):
            return False
        cache_key = STATE_CACHE_PREFIX + raw
        if not cache.get(cache_key):
            return False
        cache.delete(cache_key)
        return True
    except Exception:
        return False


class GoogleOAuthExchangeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get("code")
        redirect_uri = request.data.get("redirect_uri")
        code_verifier = request.data.get("code_verifier")
        state = request.data.get("state")
        if not code or not redirect_uri:
            return Response({"detail": "code and redirect_uri required"}, status=400)
        if not state or not _validate_oauth_state(state, "google"):
            return Response({"detail": "Invalid state"}, status=400)

        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
        if code_verifier:
            data["code_verifier"] = code_verifier

        token_resp = requests.post(token_url, data=data, timeout=10)
        if token_resp.status_code != 200:
            return Response({"detail": "Google token exchange failed", "provider_response": token_resp.text}, status=400)
        access_token = token_resp.json().get("access_token")
        if not access_token:
            return Response({"detail": "No access token returned"}, status=400)

        userinfo_resp = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}, timeout=10
        )
        if userinfo_resp.status_code != 200:
            return Response({"detail": "Failed to fetch user info"}, status=400)
        profile = userinfo_resp.json()
        email = profile.get("email")
        if not email:
            return Response({"detail": "Email not provided by provider"}, status=400)
        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email.split("@")[0][:30],
            "first_name": profile.get("given_name", ""),
            "last_name": profile.get("family_name", ""),
            "is_email_verified": profile.get("verified_email", False),
        })
        if created:
            base = user.username
            i = 1
            while User.objects.exclude(pk=user.pk).filter(username=user.username).exists():
                user.username = f"{base}{i}"[:30]
                i += 1
            user.save(update_fields=["username"])
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        response = Response({
            "access": access,
            "user": UserSerializer(user).data,
        })
        set_refresh_cookie(response, str(refresh))
        return response
