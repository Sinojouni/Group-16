import requests
import json

# Test the API endpoints
try:
    # Test getting all movies
    response = requests.get('http://localhost:8000/api/v1/movies/')
    print("Movies endpoint status code:", response.status_code)
    
    if response.status_code == 200:
        data = response.json()
        print("Movies data structure:")
        print(json.dumps(data, indent=2)[:500])  # First 500 characters
        
        # Check the first movie if available
        if isinstance(data, list) and len(data) > 0:
            print("\nFirst movie structure:")
            print(json.dumps(data[0], indent=2))
        elif isinstance(data, dict) and 'results' in data and len(data['results']) > 0:
            print("\nFirst movie structure:")
            print(json.dumps(data['results'][0], indent=2))
    else:
        print("Error:", response.text)
        
except Exception as e:
    print(f"Error connecting to API: {e}")

try:
    # Test getting trending movies
    response = requests.get('http://localhost:8000/api/v1/movies/trending/')
    print("\nTrending endpoint status code:", response.status_code)
    
    if response.status_code == 200:
        data = response.json()
        print("Trending data structure:")
        print(json.dumps(data, indent=2)[:500])  # First 500 characters
    else:
        print("Error:", response.text)
        
except Exception as e:
    print(f"Error connecting to trending API: {e}")