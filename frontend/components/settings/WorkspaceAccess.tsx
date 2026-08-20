'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import type { WorkspaceMember } from '@/types/auth';

interface WorkspaceAccessProps {
  workspaces: WorkspaceMember[];
  onLeave: (workspaceId: string) => Promise<void>;
  leaving: boolean;
}

/**
 * Displays the user's workspace memberships and a "Leave Workspace"
 * action with a confirmation modal.
 */
export function WorkspaceAccess({ workspaces, onLeave, leaving }: WorkspaceAccessProps) {
  const [confirmWorkspaceId, setConfirmWorkspaceId] = useState<string | null>(null);

  const handleLeaveClick = (workspaceId: string) => {
    setConfirmWorkspaceId(workspaceId);
  };

  const handleConfirmLeave = async () => {
    if (!confirmWorkspaceId) return;
    await onLeave(confirmWorkspaceId);
    setConfirmWorkspaceId(null);
  };

  const handleCancelLeave = () => {
    setConfirmWorkspaceId(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-foreground">Workspace Access</h2>

      <div className="space-y-2">
        {workspaces.map((membership) => (
          <div
            key={membership.id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface p-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {membership.workspace.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Role: {membership.role === 'OWNER' ? 'Owner' : 'Member'}
              </p>
            </div>
            <button
              onClick={() => handleLeaveClick(membership.workspaceId)}
              disabled={leaving}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-destructive hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" />
              Leave Workspace
            </button>
          </div>
        ))}

        {workspaces.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You are not a member of any workspace.
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmWorkspaceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Leave workspace?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You will no longer have access to this workspace. This action
              cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleCancelLeave}
                disabled={leaving}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                disabled={leaving}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {leaving ? 'Leaving...' : 'Leave Workspace'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
