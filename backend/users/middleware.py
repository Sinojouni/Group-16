"""
Custom middleware for the users app.
"""
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class APIRequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all API requests for security and monitoring.
    This replaces the more complex APIUsageLog model approach.
    """

    SKIP_PATH_PREFIXES = ('/api/health', '/api/docs', '/api/schema')
    
    def process_request(self, request):
        """
        Process the request before the view is called.
        """
        if request.path.startswith('/api/'):
            if any(request.path.startswith(p) for p in self.SKIP_PATH_PREFIXES):
                return None
            
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            TRUST_PROXY_HEADER = getattr(settings, "TRUST_PROXY_HEADER", False)

            if TRUST_PROXY_HEADER and x_forwarded_for:
                ip = x_forwarded_for.split(',')[0].strip()
            else:
                ip = request.META.get('REMOTE_ADDR')
                
            logger.info(
                f"API Request: {request.method} {request.path} from {ip} "
                f"(User: {request.user.username if request.user.is_authenticated else 'Anonymous'})"
            )
        
        return None
    
    def process_response(self, request, response):
        """
        Process the response after the view is called.
        """
        if request.path.startswith('/api/'):

            if any(request.path.startswith(p) for p in self.SKIP_PATH_PREFIXES):
                return response
 
            logger.info(f"API Response: {request.method} {request.path} - {response.status_code}")
            
        return response
