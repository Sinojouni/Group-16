from django.conf import settings
import logging

from .tasks import send_email_task

logger = logging.getLogger(__name__)


def send_verification_email(user, token):
    """
    Prepares and dispatches a task to send the email verification link.
    """
    logger.info(f"Dispatching verification email task for user {user.email}")
    subject = f"Verify your email for {settings.SITE_NAME}"
    template_name = 'users/email/verification.html'
    context = {
        'user': {
            'first_name': user.first_name,
            'username': user.username,
            'email': user.email,
        },
        'verification_url': f"{settings.FRONTEND_URL}/verify-email?token={token}",
        'site_name': settings.SITE_NAME,
    }
    send_email_task.delay(subject, template_name, context, user.email)


def send_password_reset_email(user, token):
    """
    Prepares and dispatches a task to send a password reset link.
    """
    logger.info(f"Dispatching password reset email task for user {user.email}")
    subject = f"Reset your password for {settings.SITE_NAME}"
    template_name = 'users/email/password_reset.html'
    context = {
        'user': {
            'first_name': user.first_name,
            'username': user.username,
            'email': user.email,
        },
        'reset_url': f"{settings.FRONTEND_URL}/reset-password?token={token}",
        'site_name': settings.SITE_NAME,
    }
    send_email_task.delay(subject, template_name, context, user.email)


def send_welcome_email(user):
    """
    Prepares and dispatches a task to send a welcome email.
    """
    logger.info(f"Dispatching welcome email task for user {user.email}")
    subject = f"Welcome to {settings.SITE_NAME}"
    template_name = 'users/email/welcome.html'
    context = {
        'user': {
            'first_name': user.first_name,
            'username': user.username,
            'email': user.email,
        },
        'login_url': f"{settings.FRONTEND_URL}/login",
        'site_name': settings.SITE_NAME,
    }
    send_email_task.delay(subject, template_name, context, user.email)
