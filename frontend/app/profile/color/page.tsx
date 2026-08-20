'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { getCurrentUser } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import type { ColorMode } from '@/lib/theme';

const colorOptions: { value: ColorMode; label: string; swatch: string }[] = [
  { value: 'amber', label: 'Amber', swatch: '245 158 11' },
  { value: 'blue', label: 'Blue', swatch: '59 130 246' },
  { value: 'pink', label: 'Pink', swatch: '236 72 153' },
  { value: 'rose', label: 'Rose', swatch: '244 63 94' },
  { value: 'emerald', label: 'Emerald', swatch: '16 185 129' },
  { value: 'black', label: 'Black', swatch: '17 24 39' },
];

export default function ColorSettingsPage() {
  const router = useRouter();
  const { colorMode, setColorMode } = useTheme();
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
          <h1 className="text-xl font-semibold text-foreground">Color</h1>
          <p className="text-sm text-muted-foreground">
            Choose your preferred accent color.
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {colorOptions.map((option) => {
              const isSelected = colorMode === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setColorMode(option.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-surface hover:bg-muted'
                  }`}
                  aria-label={option.label}
                >
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: `rgb(${option.swatch})` }}
                  />
                  <span className="text-xs font-medium text-foreground">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
