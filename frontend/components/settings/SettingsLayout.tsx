'use client';

import { useState, type ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';

interface SettingsLayoutProps {
  children: ReactNode;
}

/**
 * Wraps settings pages with the existing AppShell (Sidebar + Header)
 * and a settings-specific navigation sidebar.
 */
export function SettingsLayout({ children }: SettingsLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Desktop settings sidebar */}
          <div className="hidden md:block">
            <SettingsSidebar collapsed={sidebarCollapsed} />
          </div>

          {/* Mobile settings sidebar drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute inset-y-0 left-0 w-64 shadow-xl">
                <SettingsSidebar collapsed={false} onClose={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          <main className="min-w-0 flex-1 overflow-auto">
            {/* Mobile settings nav toggle */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2 md:hidden">
              <span className="text-sm font-semibold text-foreground">Settings</span>
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Open settings navigation"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {children}
          </main>
        </div>
      </div>
    </AppShell>
  );
}