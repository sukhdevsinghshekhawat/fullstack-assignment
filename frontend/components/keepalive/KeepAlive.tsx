'use client';

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
      const startTime = Date.now();
      try {
        const response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          cache: 'no-store',
        });
        const responseTime = Date.now() - startTime;
        if (response.ok) {
          console.log(
            `%c[KeepAlive] ✅ Ping successful — ${new Date().toLocaleTimeString()} — Status: ${response.status} — Response time: ${responseTime}ms`,
            'color: green; font-weight: bold;'
          );
        } else {
          console.warn(
            `%c[KeepAlive] ⚠️ Ping responded with status: ${response.status} — ${new Date().toLocaleTimeString()}`,
            'color: orange; font-weight: bold;'
          );
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        console.error(
          `%c[KeepAlive] ❌ Ping failed — ${new Date().toLocaleTimeString()} — Response time: ${responseTime}ms`,
          'color: red; font-weight: bold;',
          error
        );
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