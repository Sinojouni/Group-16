import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class Genre(models.Model):
    """Represents a movie genre."""
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Person(models.Model):
    """Represents a person who can be an actor or director."""
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Keyword(models.Model):
    """Represents a movie keyword."""
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    """Represents a single movie."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tmdb_id = models.IntegerField(unique=True, db_index=True, help_text=_("The Movie Database ID"))
    title = models.CharField(max_length=255, db_index=True)
    overview = models.TextField(blank=True, null=True)
    release_year = models.IntegerField(blank=True, null=True)
    runtime = models.IntegerField(blank=True, null=True, help_text=_("Runtime in minutes"))
    vote_average = models.FloatField(blank=True, null=True)
    vote_count = models.IntegerField(blank=True, null=True)
    popularity = models.FloatField(blank=True, null=True)
    original_language = models.CharField(max_length=10, blank=True, null=True)
    poster_path = models.CharField(max_length=255, blank=True, null=True)

    # Relationships
    genres = models.ManyToManyField(Genre, related_name="movies", blank=True)
    cast = models.ManyToManyField(Person, related_name="filmography_actor", blank=True)
    directors = models.ManyToManyField(Person, related_name="filmography_director", blank=True)
    keywords = models.ManyToManyField(Keyword, related_name="movies", blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-popularity', '-release_year']
        verbose_name = _("Movie")
        verbose_name_plural = _("Movies")

    def __str__(self):
        return f"{self.title} ({self.release_year or 'N/A'})"