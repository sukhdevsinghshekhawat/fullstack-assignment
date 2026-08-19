'use client';

import { AlertTriangle, X } from 'lucide-react';

interface TaskDeleteModalProps {
  visible: boolean;
  taskTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function TaskDeleteModal({ visible, taskTitle, onClose, onConfirm }: TaskDeleteModalProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 transform transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="delete-modal-title" className="text-lg font-semibold text-foreground">
            Delete task?
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close delete confirmation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-destructive/5 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" aria-hidden="true" />
          <p className="text-sm text-foreground">
            Are you sure you want to delete <span className="font-medium">&ldquo;{taskTitle}&rdquo;</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}