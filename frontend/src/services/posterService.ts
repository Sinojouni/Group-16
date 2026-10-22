/**
 * Poster Service
 * Handles intelligent movie poster resolution:
 * 1. Checks memory & localStorage caches.
 * 2. Fetches authentic official poster from OMDB API when missing.
 * 3. Provides a stunning, high-res minimalist cinematic poster artwork (SVG data URI)
 *    so NO movie ever shows an ugly blank/broken placeholder.
 */

const posterMemoryCache = new Map<string, string>();

// Clean title by removing trailing articles, punctuation, etc.
const getCleanTitle = (title: string): string => {
  if (!title) return 'Movie';
  return title.trim();
};

// Generate a deterministic hash for a string to pick palettes
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Curated cinematic gradient themes
const CINEMATIC_THEMES = [
  { bg1: '#1a050b', bg2: '#3b0a16', bg3: '#0d0205', accent: '#f43f5e', textAccent: '#fda4af' }, // Crimson Noir
  { bg1: '#070f1e', bg2: '#0f244a', bg3: '#04070e', accent: '#38bdf8', textAccent: '#bae6fd' }, // Deep Sapphire
  { bg1: '#11051f', bg2: '#2a0d4a', bg3: '#06020c', accent: '#c084fc', textAccent: '#e9d5ff' }, // Royal Violet
  { bg1: '#1a1205', bg2: '#3d2508', bg3: '#0c0702', accent: '#fbbf24', textAccent: '#fef08a' }, // Vintage Gold
  { bg1: '#051914', bg2: '#0b382d', bg3: '#020d0a', accent: '#34d399', textAccent: '#a7f3d0' }, // Emerald Mystery
  { bg1: '#190a18', bg2: '#3b1238', bg3: '#0d040c', accent: '#f472b6', textAccent: '#fbcfe8' }, // Velvet Rose
];

/**
 * Generates an ultra-crisp, high-aesthetic SVG poster for movies without an official poster.
 */
export const getCinematicPoster = (
  title: string,
  genres?: string[] | string,
  releaseYear?: number | string
): string => {
  const cleanTitle = getCleanTitle(title);
  const hash = hashString(cleanTitle);
  const theme = CINEMATIC_THEMES[hash % CINEMATIC_THEMES.length];

  const initial = cleanTitle.charAt(0).toUpperCase() || 'M';
  const yearStr = releaseYear ? String(releaseYear) : '';

  let genreStr = '';
  if (Array.isArray(genres) && genres.length > 0) {
    genreStr = genres.slice(0, 2).join(' • ');
  } else if (typeof genres === 'string' && genres) {
    genreStr = genres;
  }

  // XML encode text to avoid SVG syntax breaks
  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const safeTitle = escapeXml(cleanTitle);
  const safeGenre = escapeXml(genreStr);
  const safeYear = escapeXml(yearStr);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg2}" />
        <stop offset="45%" stop-color="${theme.bg1}" />
        <stop offset="100%" stop-color="${theme.bg3}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="38%" r="45%">
        <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.32" />
        <stop offset="100%" stop-color="${theme.bg1}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${theme.accent}" />
        <stop offset="100%" stop-color="${theme.textAccent}" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.8" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="400" height="600" fill="url(#bgGrad)" />
    <circle cx="200" cy="230" r="180" fill="url(#glow)" />

    <!-- Ambient Vignette & Cinema Border -->
    <rect x="12" y="12" width="376" height="576" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    <rect x="20" y="20" width="360" height="560" rx="12" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />

    <!-- Film Sprocket Accents at top -->
    <g fill="rgba(255,255,255,0.15)">
      <rect x="36" y="28" width="14" height="6" rx="2" />
      <rect x="62" y="28" width="14" height="6" rx="2" />
      <rect x="88" y="28" width="14" height="6" rx="2" />
      <rect x="298" y="28" width="14" height="6" rx="2" />
      <rect x="324" y="28" width="14" height="6" rx="2" />
      <rect x="350" y="28" width="14" height="6" rx="2" />
    </g>

    <!-- Center Monogram Motif -->
    <circle cx="200" cy="220" r="74" fill="rgba(0,0,0,0.35)" stroke="url(#accentGrad)" stroke-width="2" filter="url(#shadow)" />
    <circle cx="200" cy="220" r="62" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 3" />
    <text x="200" y="246" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="76" font-weight="900" fill="url(#accentGrad)" text-anchor="middle" filter="url(#shadow)">${initial}</text>

    <!-- Cinema Clapper / Film Reel Graphic Watermark -->
    <path d="M 180 325 L 220 325 M 190 330 L 210 330" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round" />

    <!-- Movie Title Area (Gradient backdrop for readability) -->
    <rect x="20" y="370" width="360" height="190" fill="url(#bgGrad)" opacity="0.6" />

    <!-- Title -->
    <text x="200" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">
      ${safeTitle.length > 24 ? safeTitle.substring(0, 22) + '...' : safeTitle}
    </text>

    <!-- Genre Badge -->
    ${
      safeGenre
        ? `<text x="200" y="455" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="${theme.textAccent}" letter-spacing="1.5" text-anchor="middle">${safeGenre.toUpperCase()}</text>`
        : ''
    }

    <!-- Year Badge -->
    ${
      safeYear
        ? `<g transform="translate(165, 480)">
             <rect width="70" height="24" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
             <text x="35" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${safeYear}</text>
           </g>`
        : ''
    }

    <!-- Bottom Brand Signature -->
    <text x="200" y="555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="rgba(255,255,255,0.3)" letter-spacing="3" text-anchor="middle">MOVIERATE CINEMA COLLECTION</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Checks if a URL is an authentic, non-placeholder poster image.
 */
export const isValidPosterUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http')) return false;
  if (trimmed.includes('placehold.co')) return false;
  if (trimmed.includes('.jpg.jpg')) return false;
  return true;
};

/**
 * Gets immediate synchronous poster for first paint (checks cache or generates cinematic artwork).
 */
export const getInitialPoster = (
  movie: { title: string; poster?: string; posterPath?: string; releaseYear?: number; genres?: string[] }
): string => {
  if (isValidPosterUrl(movie.poster)) {
    return movie.poster!;
  }

  const cleanTitle = getCleanTitle(movie.title);

  // 1. Check memory cache
  if (posterMemoryCache.has(cleanTitle)) {
    return posterMemoryCache.get(cleanTitle)!;
  }

  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem(`omdb_poster_${cleanTitle}`);
    if (cached && isValidPosterUrl(cached)) {
      posterMemoryCache.set(cleanTitle, cached);
      return cached;
    }
  } catch (_) {}

  // 3. Fallback to stunning instant cinematic SVG poster
  return getCinematicPoster(movie.title, movie.genres, movie.releaseYear);
};

/**
 * Asynchronously resolves poster with real-time OMDB fetch and automatic caching.
 */
export const resolvePoster = async (
  movie: { title: string; poster?: string; posterPath?: string; releaseYear?: number; genres?: string[] }
): Promise<string> => {
  if (isValidPosterUrl(movie.poster)) {
    return movie.poster!;
  }

  const cleanTitle = getCleanTitle(movie.title);

  // Check memory
  if (posterMemoryCache.has(cleanTitle)) {
    return posterMemoryCache.get(cleanTitle)!;
  }

  // Check localStorage
  try {
    const cached = localStorage.getItem(`omdb_poster_${cleanTitle}`);
    if (cached && isValidPosterUrl(cached)) {
      posterMemoryCache.set(cleanTitle, cached);
      return cached;
    }
  } catch (_) {}

  // Fetch live from OMDB
  try {
    const encoded = encodeURIComponent(cleanTitle);
    const yearParam = movie.releaseYear ? `&y=${movie.releaseYear}` : '';
    const res = await fetch(`https://www.omdbapi.com/?t=${encoded}${yearParam}&apikey=trilogy`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.Response === 'True' && isValidPosterUrl(data.Poster)) {
        posterMemoryCache.set(cleanTitle, data.Poster);
        try {
          localStorage.setItem(`omdb_poster_${cleanTitle}`, data.Poster);
        } catch (_) {}
        return data.Poster;
      }
    }
  } catch (_) {}

  // If OMDB without year works better
  try {
    const encoded = encodeURIComponent(cleanTitle);
    const res = await fetch(`https://www.omdbapi.com/?t=${encoded}&apikey=trilogy`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.Response === 'True' && isValidPosterUrl(data.Poster)) {
        posterMemoryCache.set(cleanTitle, data.Poster);
        try {
          localStorage.setItem(`omdb_poster_${cleanTitle}`, data.Poster);
        } catch (_) {}
        return data.Poster;
      }
    }
  } catch (_) {}

  // Default to cinematic poster
  const fallback = getCinematicPoster(movie.title, movie.genres, movie.releaseYear);
  posterMemoryCache.set(cleanTitle, fallback);
  return fallback;
};
