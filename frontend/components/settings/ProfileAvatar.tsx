'use client';

import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import type { GuestUser } from '@/types/auth';

interface ProfileAvatarProps {
  user: GuestUser;
  onAvatarChange: (url: string | null) => void;
  editing: boolean;
}

/**
 * Displays the user's avatar with an optional edit overlay.
 * When editing, shows a camera button to change the avatar URL
 * and a clear button to remove it.
 */
export function ProfileAvatar({ user, onAvatarChange, editing }: ProfileAvatarProps) {
  const [inputValue, setInputValue] = useState(user.avatarUrl ?? '');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUrlSave = () => {
    const trimmed = inputValue.trim() || null;
    onAvatarChange(trimmed);
    setShowUrlInput(false);
  };

  const handleUrlCancel = () => {
    setInputValue(user.avatarUrl ?? '');
    setShowUrlInput(false);
  };

  const initials = (user.fullName ?? user.name ?? user.email ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName ?? user.name ?? 'User avatar'}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
            {initials}
          </div>
        )}

        {editing && (
          <>
            <button
              onClick={() => setShowUrlInput(true)}
              className="absolute bottom-0 right-0 rounded-full border-2 border-background bg-accent p-1.5 text-xs text-accent-foreground opacity-90 shadow-sm hover:opacity-100"
              aria-label="Change avatar"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Avatar image URL"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-56 rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUrlSave();
              if (e.key === 'Escape') handleUrlCancel();
            }}
          />
          <button
            onClick={handleUrlSave}
            className="text-xs font-medium text-accent hover:opacity-80"
          >
            Save
          </button>
          <button
            onClick={handleUrlCancel}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
