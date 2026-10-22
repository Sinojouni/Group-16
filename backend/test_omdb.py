import urllib.request
import urllib.parse
import json

titles = [
    'All the Vermeers in New York',
    'The Sailor Who Fell from Grace with the Sea',
    "L'associé"
]

for t in titles:
    encoded = urllib.parse.quote(t)
    url = f"https://www.omdbapi.com/?t={encoded}&apikey=trilogy"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'MovieRate/1.0'})
        data = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
        print(t, "==>", data.get('Poster'))
    except Exception as e:
        print(t, "ERROR:", e)
