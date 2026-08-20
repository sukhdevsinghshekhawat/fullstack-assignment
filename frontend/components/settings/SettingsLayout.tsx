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

  return (
    <AppShell>
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <SettingsSidebar collapsed={sidebarCollapsed} />
          <main className="min-w-0 flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AppShell>
  );
}
