'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Search, UserPlus, X } from 'lucide-react';
import type { TaskMember } from '@/types/task';

interface TaskMemberSelectorProps {
  members: TaskMember[];
  selectedIds: string[];
  onSelect: (memberId: string) => void;
  onRemove: (memberId: string) => void;
}

export function TaskMemberSelector({
  members,
  selectedIds,
  onSelect,
  onRemove,
}: TaskMemberSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (m.name?.toLowerCase().includes(q) ?? false) ||
      (m.email?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="relative" ref={ref}>
      {/* Selected avatars */}
      <div className="flex items-center gap-1 flex-wrap">
        {selectedIds.length === 0 && (
          <button
            onClick={() => setOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            aria-label="Add member"
          >
            <UserPlus className="h-3.5 w-3.5" />
          </button>
        )}
        {selectedIds.map((id) => {
          const member = members.find((m) => m.id === id);
          if (!member) return null;
          return (
            <div
              key={id}
              className="group relative flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent"
              title={member.name || member.email || 'Member'}
            >
              {(member.name || member.email || '?').charAt(0).toUpperCase()}
              <button
                onClick={() => onRemove(id)}
                className="absolute -top-1 -right-1 hidden h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                aria-label={`Remove ${member.name || 'member'}`}
              >
                <X className="h-2 w-2" />
              </button>
            </div>
          );
        })}
        {selectedIds.length > 0 && (
          <button
            onClick={() => setOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            aria-label="Add member"
          >
            <UserPlus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-md bg-surface border border-border shadow-dropdown py-1 z-20">
          <div className="px-2 pb-1 pt-1">
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">No members found</p>
            )}
            {filtered.map((m) => {
              const isSelected = selectedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    if (isSelected) {
                      onRemove(m.id);
                    } else {
                      onSelect(m.id);
                    }
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-muted transition-colors"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                    {(m.name || m.email || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-1 truncate text-foreground">
                    {m.name || m.email || 'Unnamed'}
                  </span>
                  {isSelected && <Check className="h-4 w-4 text-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}