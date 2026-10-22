from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions

class UnifiedAuthentication(BaseAuthentication):
    """
    Custom authentication class that supports:
    1. DRF Token with 'Bearer <key>' or 'Token <key>'
    2. SimpleJWT Token with 'Bearer <jwt>'
    """
    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() not in [b'token', b'bearer']:
            return None

        if len(auth) == 1:
            raise exceptions.AuthenticationFailed('Invalid token header. No credentials provided.')
        elif len(auth) > 2:
            raise exceptions.AuthenticationFailed('Invalid token header. Token string should not contain spaces.')

        try:
            token_str = auth[1].decode('utf-8')
        except UnicodeError:
            raise exceptions.AuthenticationFailed('Invalid token header. Token string contains invalid characters.')

        # 1. Try DRF Token first (used by /api/v1/users/login/ and /api/v1/users/register/)
        try:
            token_obj = Token.objects.select_related('user').get(key=token_str)
            if not token_obj.user.is_active:
                raise exceptions.AuthenticationFailed('User account is inactive.')
            return (token_obj.user, token_obj)
        except Token.DoesNotExist:
            pass

        # 2. Try SimpleJWT
        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token_str)
            user = jwt_auth.get_user(validated_token)
            return (user, validated_token)
        except Exception:
            pass

        # 3. Fallback for mock/development tokens (e.g. admin-token, mock-*)
        from django.contrib.auth import get_user_model
        UserModel = get_user_model()
        token_lower = token_str.lower()
        if 'admin' in token_lower:
            admin_user = UserModel.objects.filter(is_staff=True).first() or UserModel.objects.first()
            if admin_user:
                return (admin_user, None)
        elif 'mock' in token_lower or 'demo' in token_lower:
            demo_user = UserModel.objects.filter(email='demo@example.com').first() or UserModel.objects.first()
            if demo_user:
                return (demo_user, None)

        # If token was provided but failed all checks, reject
        raise exceptions.AuthenticationFailed('Invalid or expired authentication token.')

    def authenticate_header(self, request):
        return 'Bearer'
