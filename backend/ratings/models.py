import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from movies.models import Movie

class Rating(models.Model):
    """
    Represents a rating given by a user to a movie.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ratings",
        help_text="The user who made the rating."
    )
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="ratings",
        help_text="The movie being rated."
    )
    score = models.FloatField(
        validators=[MinValueValidator(0.5), MaxValueValidator(5.0)],
        help_text="The score given by the user (0.5 to 5.0)."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # A user can only rate a specific movie once.
        unique_together = ('user', 'movie')
        ordering = ['-updated_at']
        verbose_name = "Rating"
        verbose_name_plural = "Ratings"

    def __str__(self):
        return f"{self.user.email} rated {self.movie.title} with {self.score}"