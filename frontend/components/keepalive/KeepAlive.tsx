import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const PING_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds

/**
 * KeepAlive component that pings the backend /health endpoint
 * every 3 minutes to prevent Render's free tier from sleeping.
 * This component renders nothing visually.
 */
export default function KeepAlive() {
  useEffect(() => {
    // Only run in production or when API URL is set
    if (!process.env.NEXT_PUBLIC_API_URL) return;

    const pingBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          cache: 'no-store',
        });
        if (response.ok) {
          console.log('[KeepAlive] Backend is awake:', new Date().toISOString());
        } else {
          console.warn('[KeepAlive] Backend responded with status:', response.status);
        }
      } catch (error) {
        console.error('[KeepAlive] Failed to ping backend:', error);
      }
    };

    // Ping immediately on mount
    pingBackend();

    // Then ping every 3 minutes
    const intervalId = setInterval(pingBackend, PING_INTERVAL);

    // Also ping when the tab becomes visible again (e.g. user returns to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pingBackend();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}