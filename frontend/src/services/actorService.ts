/**
 * Actor Service
 * Fetches real, authentic high-resolution actor photos from the Wikipedia PageImages API.
 * Uses localStorage and in-memory cache for instant subsequent loading.
 */

const memoryCache = new Map<string, string>();

export const getActorPhoto = async (actorName: string): Promise<string | null> => {
  if (!actorName || typeof actorName !== 'string') return null;
  const name = actorName.trim();
  if (!name) return null;

  // 1. Check in-memory cache
  if (memoryCache.has(name)) {
    return memoryCache.get(name)!;
  }

  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem(`actor_photo_${name}`);
    if (cached) {
      memoryCache.set(name, cached);
      return cached;
    }
  } catch (_) {}

  // 3. Query Wikipedia API with CORS origin=*
  try {
    const endpoint = `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(
      name
    )}&prop=pageimages&format=json&pithumbsize=400`;

    const res = await fetch(endpoint);
    if (!res.ok) return null;

    const data = await res.json();
    const pages = data?.query?.pages;
    if (pages) {
      for (const pageId of Object.keys(pages)) {
        const thumb = pages[pageId]?.thumbnail?.source;
        if (thumb && typeof thumb === 'string') {
          memoryCache.set(name, thumb);
          try {
            localStorage.setItem(`actor_photo_${name}`, thumb);
          } catch (_) {}
          return thumb;
        }
      }
    }
  } catch (err) {
    console.error('Error fetching actor photo for:', name, err);
  }

  return null;
};
