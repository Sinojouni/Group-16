"""
Custom authentication backends.
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Authentication backend that allows login with either username or email.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        login_value = username or kwargs.get(UserModel.USERNAME_FIELD) or kwargs.get('email')
        if not login_value or not password:
            return None
        try:
            user = UserModel.objects.get(
                Q(username__iexact=login_value) | Q(email__iexact=login_value)
            )
        except UserModel.DoesNotExist:
            UserModel().set_password(password)
            return None
        if not user.is_active:
            return None
        if user.check_password(password):
            return user
        return None
