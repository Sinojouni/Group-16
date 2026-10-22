"""
URL configuration for config project.
"""
import io
from django.contrib import admin
from django.core.management import call_command
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

def run_migrations_view(request):
    try:
        out = io.StringIO()
        call_command('migrate', interactive=False, stdout=out)
        return JsonResponse({
            'status': 'success',
            'message': 'Database migrations completed successfully!',
            'output': out.getvalue()
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

urlpatterns = [
    path('', lambda request: redirect('swagger-ui', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/v1/migrate/', run_migrations_view, name='run-migrations'),

    path('api/v1/', include('users.urls')),
    path('api/v1/', include('movies.urls')),
    path('api/v1/', include('ratings.urls')),
    path('api/v1/', include('recommendations.urls')),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]