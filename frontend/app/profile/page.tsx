'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { WorkspaceAccess } from '@/components/settings/WorkspaceAccess';
import { getCurrentUser } from '@/lib/auth';
import { getProfile, updateProfile, getWorkspaces, leaveWorkspace } from '@/lib/users';
import type { GuestUser, WorkspaceMember, UpdateProfileInput } from '@/types/auth';
import type { ApiError } from '@/types/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<GuestUser | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profile, ws] = await Promise.all([getProfile(), getWorkspaces()]);
      setUser(profile);
      setWorkspaces(ws);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.statusCode === 401) {
        router.push('/login');
        return;
      }
      setError('Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Verify authentication first, then load profile.
    getCurrentUser()
      .then(() => fetchProfile())
      .catch(() => router.push('/login'));
  }, [fetchProfile, router]);

  const handleSave = async (input: UpdateProfileInput) => {
    setSaving(true);
    try {
      const updated = await updateProfile(input);
      setUser(updated);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.statusCode === 409) {
        // Username conflict — the error message is already descriptive.
        setError(apiError.message ?? 'Username is already taken.');
      } else {
        setError('Failed to update profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLeave = async (workspaceId: string) => {
    setLeaving(true);
    try {
      await leaveWorkspace(workspaceId);
      setWorkspaces((prev) =>
        prev.filter((w) => w.workspaceId !== workspaceId),
      );
      // Redirect to tasks after leaving the workspace.
      router.push('/tasks');
    } catch (err) {
      setError('Failed to leave workspace.');
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <SettingsLayout>
        <div className="p-8">
          <div className="max-w-2xl space-y-6">
            <div className="h-7 w-32 animate-pulse rounded bg-muted" />
            <div className="flex justify-center">
              <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SettingsLayout>
    );
  }

  if (error) {
    return (
      <SettingsLayout>
        <div className="p-8">
          <div className="max-w-2xl">
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span>{error}</span>
              <button
                onClick={fetchProfile}
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </SettingsLayout>
    );
  }

  if (!user) return null;

  return (
    <SettingsLayout>
      <div className="p-8">
        <div className="max-w-2xl space-y-8">
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>

          <ProfileForm user={user} onSave={handleSave} saving={saving} />

          <div className="border-t border-border pt-6">
            <WorkspaceAccess
              workspaces={workspaces}
              onLeave={handleLeave}
              leaving={leaving}
            />
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
