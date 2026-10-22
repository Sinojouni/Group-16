#!/usr/bin/env python
"""
Simple Django configuration test script.
Run this to verify that Django is properly configured.
"""

import os
import sys
import django

def test_django_config():
    """Test Django configuration and app registration."""
    print("🔍 Testing Django Configuration...")
    print("=" * 50)
    
    try:
        # Set Django settings
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        django.setup()
        
        print("✅ Django setup successful!")
        
        # Test app registration
        from django.apps import apps
        installed_apps = [app.label for app in apps.get_app_configs()]
        
        print(f"\n📱 Installed apps ({len(installed_apps)}):")
        for app in installed_apps:
            print(f"  ✅ {app}")
        
        # Test specific apps
        required_apps = ['users', 'movies', 'ratings', 'recommendations']
        missing_apps = [app for app in required_apps if app not in installed_apps]
        
        if missing_apps:
            print(f"\n❌ Missing required apps: {missing_apps}")
            return False
        else:
            print(f"\n✅ All required apps are registered!")
        
        # Test models import
        print(f"\n🎬 Testing model imports:")
        
        try:
            from users.models import User
            print("  ✅ User model imported successfully")
        except Exception as e:
            print(f"  ❌ User model import failed: {e}")
            return False
            
        try:
            from movies.models import Movie
            print("  ✅ Movie model imported successfully")
        except Exception as e:
            print(f"  ❌ Movie model import failed: {e}")
            return False
            
        try:
            from ratings.models import Rating
            print("  ✅ Rating model imported successfully")
        except Exception as e:
            print(f"  ❌ Rating model import failed: {e}")
            return False
        
        # Test settings
        from django.conf import settings
        print(f"\n⚙️  Key settings:")
        print(f"  ✅ DEBUG: {settings.DEBUG}")
        print(f"  ✅ AUTH_USER_MODEL: {settings.AUTH_USER_MODEL}")
        print(f"  ✅ DATABASE ENGINE: {settings.DATABASES['default']['ENGINE']}")
        
        print(f"\n🎉 All tests passed! Django is properly configured.")
        return True
        
    except Exception as e:
        print(f"❌ Django configuration error: {e}")
        return False

if __name__ == "__main__":
    success = test_django_config()
    sys.exit(0 if success else 1)

