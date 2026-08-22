'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { loginAsGuest } from '@/lib/auth';
import type { ApiError } from '@/types/auth';

export function LoginCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin() {
    if (loading) return; // prevent duplicate requests

    setLoading(true);
    setError(null);
    try {
      await loginAsGuest();
      router.push('/tasks');
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.message ??
          'Something went wrong. Please try again in a moment.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Let's get back on track
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email below to login to your account.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Button onClick={handleGuestLogin} loading={loading}>
            Continue as Guest
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" disabled>
            <GoogleIcon />
            Login with Google
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </div>
  );
}