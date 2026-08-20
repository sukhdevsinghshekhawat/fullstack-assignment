'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { getCurrentUser } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

const themeOptions: { value: Theme; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'Light theme with a clean, bright interface' },
  { value: 'dark', label: 'Dark', description: 'Dark theme for low-light environments' },
];

export default function ThemeSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(() => setAuthChecked(true))
      .catch(() => router.push('/login'));
  }, [router]);

  if (!authChecked) {
    return (
      <SettingsLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout>
      <div className="p-8">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-xl font-semibold text-foreground">Theme</h1>
          <p className="text-sm text-muted-foreground">
            Choose your preferred application theme.
          </p>

          <div className="space-y-3">
            {themeOptions.map((option) => {
              const isSelected = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-surface hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? 'border-accent bg-accent text-accent-foreground'
                          : 'border-border'
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {option.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
