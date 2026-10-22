/**
 * Centralized API Configuration for MovieRate
 * 
 * Supports:
 * 1. Production environments (Vercel, Docker, Railway, Render)
 * 2. Local Vite development
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api/v1'
    : 'http://localhost:8000/api/v1');
