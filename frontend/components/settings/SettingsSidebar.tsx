'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, Droplet, Palette, User, X } from 'lucide-react';

interface SettingsSidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/profile/theme', label: 'Theme', icon: Palette },
  { href: '/profile/color', label: 'Color', icon: Droplet },
];

export function SettingsSidebar({ collapsed = false, onClose }: SettingsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-surface transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        {!collapsed && (
          <span className="text-lg font-semibold text-foreground">Settings</span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Close settings navigation"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-3">
        <button
          onClick={() => router.push('/tasks')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
            collapsed ? 'justify-center' : ''
          }`}
          aria-label="Back to app"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to app</span>}
        </button>
      </div>
    </aside>
  );
}