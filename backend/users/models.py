import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class User(AbstractUser):

    id=models.UUIDField(primary_key=True,
                         default=uuid.uuid4,
                         editable=False,
                         unique=True,
                         help_text=_("Unique identifier for the user"),
                        )
    
    email=models.EmailField(
                            _("email address"),
                            unique=True,
                            help_text="Email address of the user",
                            error_messages={
                                "unique": _("A user with that email already exists."),},
                            )
    
    is_email_verified=models.BooleanField(
                            default=False,
                            help_text=_("Indicates whether the user's email address has been verified"),
                        )
    

    created_at=models.DateTimeField(
                            auto_now_add=True,
                            help_text=_("Timestamp when the user was created"),
                        )
    

    updated_at=models.DateTimeField(
                            auto_now=True,
                            help_text=_("Timestamp when the user was last updated"),
                        )
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=['is_email_verified'], name='email_verified_idx'),

        ]

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.email
    
    def verify_email(self):
        self.is_email_verified = True
        self.save(update_fields=['is_email_verified'])


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification_tokens",
        help_text=_("The user associated with this email verification token"),
    )
    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        help_text=_("Unique token for email verification"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("Timestamp when the token was created"),
    )
    expires_at = models.DateTimeField(
        null=False,
        blank=False,
        db_index=True,
        help_text=_("Timestamp when the token expires"),
    )

    is_used = models.BooleanField(
        default=False,
        db_index=True,
        help_text=_("Indicates whether the token has been used"),
    )

    class Meta:
        verbose_name = _("email verification token")
        verbose_name_plural = _("email verification tokens")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token', 'is_used']),
        ]

    def __str__(self):
        return f"Token for {self.user.email} - Expires at {self.expires_at}"
    
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at
    

class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_reset_tokens",
        help_text=_("The user associated with this password reset token"),
    )
    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        help_text=_("Unique token for password reset"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("Timestamp when the token was created"),
    )
    expires_at = models.DateTimeField(
        null=False,
        blank=False,
        db_index=True,
        help_text=_("Timestamp when the token expires"),
    )

    is_used = models.BooleanField(
        default=False,
        db_index=True,
        help_text=_("Indicates whether the token has been used"),
    )

    class Meta:
        verbose_name = _("password reset token")
        verbose_name_plural = _("password reset tokens")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token', 'is_used']),
        ]

    def __str__(self):
        return f"Password Reset Token for {self.user.email} - Expires at {self.expires_at}"
    
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at