'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, FolderKanban, X } from 'lucide-react';
import { PyramidLogo } from '@/components/logo/PyramidLogo';

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

export function Sidebar({ collapsed, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-surface transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo / Brand */}
      <div className={`flex h-14 items-center border-b border-border ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
        {collapsed ? (
          <PyramidLogo className="h-7 w-7" />
        ) : (
          <div className="flex items-center gap-2">
            <PyramidLogo className="h-7 w-7" />
            <span className="text-lg font-semibold text-foreground">TaskFlow</span>
          </div>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Workspace section */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="mb-2 px-2">
          {!collapsed && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Workspace
            </p>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User avatar at bottom */}
      <div className={`border-t border-border p-3 ${collapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          D
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">Dexter</p>
            <p className="truncate text-xs text-muted-foreground">Guest</p>
          </div>
        )}
      </div>
    </aside>
  );
}