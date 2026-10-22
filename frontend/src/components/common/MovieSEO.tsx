import React, { useEffect } from 'react';
import { Movie, Review } from '../../types';

interface MovieSEOProps {
  movie: Movie;
  reviews?: Review[];
  language?: string;
}

export const MovieSEO: React.FC<MovieSEOProps> = ({ movie, reviews = [], language = 'ar' }) => {
  const isArabic = language === 'ar';
  const siteName = 'MovieRate - تقييمات وتوصيات الأفلام بالذكاء الاصطناعي';
  const pageTitle = `${movie.title} (${movie.releaseYear || ''}) - تقييم الفيلم ومراجعاته | MovieRate`;
  const description = movie.overview || movie.synopsis || `اكتشف تقييمات، مراجعات، طاقم عمل، وتوصيات فيلم ${movie.title} على منصة MovieRate.`;
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : `http://localhost:5173/movie/${movie.id}`;
  const posterUrl = movie.poster || '';
  const directorName = movie.crew && movie.crew.length > 0 ? movie.crew[0].name : (movie.director || 'غير محدد');
  const castList = (movie.cast || []).map(c => c.name);
  const genreList = movie.genres || [];
  const ratingValue = movie.averageRating ? Number(movie.averageRating).toFixed(1) : '7.0';
  const voteCount = movie.totalRatings || movie.voteCount || 100;

  useEffect(() => {
    // 1. Update Document Title
    const originalTitle = document.title;
    document.title = pageTitle;

    // 2. Helper to set or update meta tags in <head>
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for link tags (canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard SEO Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', `${movie.title}, أفلام, تقييمات, مراجعات, ${genreList.join(', ')}, ${castList.slice(0, 5).join(', ')}, movie review, ratings`);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setLinkTag('canonical', canonicalUrl);

    // Social & OpenGraph Meta Tags
    setMetaTag('property', 'og:type', 'video.movie');
    setMetaTag('property', 'og:title', `${movie.title} (${movie.releaseYear || ''})`);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', posterUrl);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:site_name', 'MovieRate');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', `${movie.title} (${movie.releaseYear || ''})`);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', posterUrl);

    // AI SEO / GEO (Generative Engine Optimization) Meta Tags
    // Used by AI search engines like ChatGPT Search, Perplexity, Claude & Gemini
    setMetaTag('name', 'ai-content-type', 'movie-review-analysis');
    setMetaTag('name', 'ai-entity', 'Movie');
    setMetaTag('name', 'ai-title', movie.title);
    setMetaTag('name', 'ai-release-year', String(movie.releaseYear || ''));
    setMetaTag('name', 'ai-director', directorName);
    setMetaTag('name', 'ai-cast', castList.join(', '));
    setMetaTag('name', 'ai-rating-consensus', `Rated ${ratingValue}/10 based on ${voteCount} audience votes`);
    setMetaTag('name', 'ai-summary', `${movie.title} is a ${genreList.join('/')} movie released in ${movie.releaseYear || 'N/A'}, directed by ${directorName}, starring ${castList.slice(0, 3).join(', ')}. Story overview: ${description}`);
    setMetaTag('name', 'chatgpt-description', `MovieRate database entry for ${movie.title}. Audience score: ${ratingValue}/10. Synopsis and review analysis.`);
    setMetaTag('name', 'perplexity-citation', `MovieRate: Full overview and user ratings for ${movie.title} (${movie.releaseYear}).`);

    // 3. Structured Data JSON-LD (Schema.org / Google Rich Snippets)
    const jsonLdScriptId = `json-ld-movie-${movie.id}`;
    let scriptTag = document.getElementById(jsonLdScriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdScriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Movie",
      "@id": canonicalUrl,
      "name": movie.title,
      "alternateName": movie.originalTitle || movie.title,
      "description": description,
      "image": posterUrl,
      "datePublished": movie.releaseDate || (movie.releaseYear ? `${movie.releaseYear}-01-01` : undefined),
      "genre": genreList,
      "duration": movie.runtime ? `PT${movie.runtime}M` : undefined,
      "director": {
        "@type": "Person",
        "name": directorName
      },
      "actor": castList.slice(0, 8).map(name => ({
        "@type": "Person",
        "name": name
      })),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "bestRating": "10",
        "worstRating": "1",
        "ratingCount": voteCount
      },
      "review": reviews.slice(0, 5).map(rev => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": rev.rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": rev.username || "عضو MovieRate"
        },
        "reviewBody": rev.comment || `تقييم ${rev.rating} نجوم`,
        "datePublished": rev.createdAt
      }))
    };

    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = originalTitle;
      const script = document.getElementById(jsonLdScriptId);
      if (script) {
        script.remove();
      }
    };
  }, [movie, reviews, language, pageTitle, description, canonicalUrl, posterUrl, directorName, castList, genreList, ratingValue, voteCount]);

  // AI-Semantic Section for Web Crawlers & LLMs (GEO)
  // Screen reader only (visually hidden), perfectly indexable by search engines and LLM RAG pipelines
  return (
    <aside
      aria-label="Movie Factsheet for AI Search Engines"
      className="sr-only"
      data-geo-entity="Movie"
      data-ai-engine="geo-optimized"
    >
      <h2>حقائق ومعلومات الفيلم - {movie.title}</h2>
      <dl>
        <dt>العنوان الأصلي:</dt>
        <dd>{movie.title}</dd>
        <dt>سنة الإصدار:</dt>
        <dd>{movie.releaseYear || 'غير محدد'}</dd>
        <dt>النوع والتصنيف:</dt>
        <dd>{genreList.join(', ')}</dd>
        <dt>المخرج:</dt>
        <dd>{directorName}</dd>
        <dt>طاقم التمثيل:</dt>
        <dd>{castList.join(', ')}</dd>
        <dt>التقييم الجماهيري على MovieRate:</dt>
        <dd>{ratingValue} من 10 (بناءً على {voteCount} تصويت ومراجعة)</dd>
        <dt>ملخص القصة الرسمي:</dt>
        <dd>{description}</dd>
      </dl>
    </aside>
  );
};

export default MovieSEO;
