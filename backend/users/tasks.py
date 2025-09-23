from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_task(self, subject, template_name, context, to_email):
    """
    Celery task to send a templated email with automatic retries.

    This single task handles the actual sending of all emails in the background.
    """
    try:
        logger.info(f"Sending email to {to_email} with subject '{subject}'")

        html_message = render_to_string(template_name, context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        logger.info(f"Successfully sent email to {to_email}")

    except Exception as exc:
        logger.error(f"Error sending email to {to_email}: {exc}. Retrying...")
        self.retry(exc=exc)