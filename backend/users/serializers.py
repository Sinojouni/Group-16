from rest_framework import serializers
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.models import EmailVerificationToken as EmailVerification
from users.models import PasswordResetToken as PasswordReset

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    Used for retrieving user details.
    """
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "is_email_verified",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "is_email_verified", "created_at", "updated_at")


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user.
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id","email","username","first_name","last_name","password","password_confirm")
        read_only_fields = ("id",)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        username = attrs.get("username")
        if username and User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": _("A user with that username already exists.")})
        return attrs

    def create(self, validated_data):
        """Create user without sending verification email (handled in view).

        Also normalizes email to lower-case to avoid duplicates differing only by case.
        """
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        email = validated_data.get("email")
        if email:
            validated_data["email"] = email.lower()
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user details.
    """
    class Meta:
        model = User
        fields = [
            'username', 'first_name', 'last_name'
        ]
    
    def validate_username(self, value):
        """Case-insensitive uniqueness validation excluding current user."""
        user = self.context['request'].user
        if User.objects.filter(username__iexact=value).exclude(id=user.id).exists():
            raise serializers.ValidationError(_("A user with that username already exists."))
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing a user's password.
    """
    current_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """
        Validate that the current password is correct and the new passwords match.
        """
        user = self.context['request'].user
        
        if not user.check_password(attrs.get('current_password')):
            raise serializers.ValidationError({
                'current_password': _("Current password is incorrect")
            })
        
        if attrs.get('new_password') != attrs.get('new_password_confirm'):
            raise serializers.ValidationError({
                'new_password_confirm': _("New password fields don't match")
            })
        
        return attrs
    
    def save(self, **kwargs):
        """Update password; keep session authenticated if sessions are used."""
        user = kwargs.get('user') or self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        request = self.context.get('request')
        if request:
            try:
                update_session_auth_hash(request, user)
            except Exception:
                pass
        return user


class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.UUIDField(required=True)

    def validate(self, attrs):
        try:
            token_uuid = attrs['token']
            verification = EmailVerification.objects.select_for_update().select_related('user').get(token=token_uuid)

            if verification.is_used:
                raise serializers.ValidationError(_("This verification link has already been used."))
            if not verification.is_valid():
                raise serializers.ValidationError(_("This verification link has expired."))

            attrs['verification_obj'] = verification
            return attrs
        except EmailVerification.DoesNotExist:
            raise serializers.ValidationError(_("Invalid verification token."))


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset.
    """
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        """
        Validate that a user with the given email exists.
        """
        if not User.objects.filter(email=value).exists():
            return value
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for confirming a password reset.
    """
    token = serializers.UUIDField(required=True)
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """
        Validate that the token is valid and the new passwords match.
        """
        if attrs.get('new_password') != attrs.get('new_password_confirm'):
            raise serializers.ValidationError({
                'new_password_confirm': _("Password fields don't match")
            })
        
        try:
            reset = PasswordReset.objects.select_for_update().get(token=attrs.get('token'))
            if reset.is_used:
                raise serializers.ValidationError({
                    'token': _("This reset link has already been used.")
                })
            
            if not reset.is_valid():
                raise serializers.ValidationError({
                    'token': _("This reset link has expired.")
                })
        
            self.reset = reset
            
        except PasswordReset.DoesNotExist:
            raise serializers.ValidationError({
                'token': _("Invalid reset token.")
            })
        
        return attrs
    
    def save(self, **kwargs):
        """Atomically reset password & invalidate token to prevent race reuse."""
        with transaction.atomic():
            user = self.reset.user
            user.set_password(self.validated_data['new_password'])
            user.save(update_fields=['password'])
            self.reset.is_used = True
            self.reset.save(update_fields=['is_used'])
        return user


class TokenObtainPairWithUserSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
