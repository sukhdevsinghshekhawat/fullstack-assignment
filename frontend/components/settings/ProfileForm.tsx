'use client';

import { useState } from 'react';
import { ProfileAvatar } from '@/components/settings/ProfileAvatar';
import type { GuestUser, UpdateProfileInput } from '@/types/auth';

interface ProfileFormProps {
  user: GuestUser;
  onSave: (input: UpdateProfileInput) => Promise<void>;
  saving: boolean;
}

/**
 * Editable profile form. Shows avatar, email (read-only),
 * full name, title, and username fields.
 */
export function ProfileForm({ user, onSave, saving }: ProfileFormProps) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName ?? '');
  const [title, setTitle] = useState(user.title ?? '');
  const [username, setUsername] = useState(user.username ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAvatarChange = (url: string | null) => {
    setAvatarUrl(url);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (fullName && fullName.length > 100) {
      newErrors.fullName = 'Full name must be 100 characters or fewer';
    }
    if (title && title.length > 100) {
      newErrors.title = 'Title must be 100 characters or fewer';
    }
    if (username) {
      if (username.length > 30) {
        newErrors.username = 'Username must be 30 characters or fewer';
      } else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
        newErrors.username =
          'Username may only contain letters, numbers, underscores, dots and hyphens';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setErrors({});
    const input: UpdateProfileInput = {
      fullName: fullName || undefined,
      title: title || undefined,
      username: username || undefined,
      avatarUrl: avatarUrl ?? undefined,
    };
    await onSave(input);
    setEditing(false);
  };

  const handleCancel = () => {
    setFullName(user.fullName ?? '');
    setTitle(user.title ?? '');
    setUsername(user.username ?? '');
    setAvatarUrl(user.avatarUrl ?? null);
    setErrors({});
    setEditing(false);
  };

  const displayUser: GuestUser = {
    ...user,
    fullName: fullName || null,
    title: title || null,
    username: username || null,
    avatarUrl: avatarUrl,
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex justify-center">
        <ProfileAvatar
          user={displayUser}
          onAvatarChange={handleAvatarChange}
          editing={editing}
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          type="email"
          value={user.email ?? ''}
          readOnly
          className="mt-1 block w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={!editing}
          placeholder="Enter your full name"
          className={`mt-1 block w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.fullName ? 'border-destructive' : ''
          }`}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!editing}
          placeholder="e.g. Designer, Developer"
          className={`mt-1 block w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.title ? 'border-destructive' : ''
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!editing}
          placeholder="Enter a username"
          className={`mt-1 block w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.username ? 'border-destructive' : ''
          }`}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-destructive">{errors.username}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        {editing ? (
          <>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
