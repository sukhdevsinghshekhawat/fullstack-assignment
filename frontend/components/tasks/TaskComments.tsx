'use client';

import { useState } from 'react';
import type { TaskComment as TaskCommentType } from '@/types/task';
import { TaskComment } from './TaskComment';

interface TaskCommentsProps {
  comments: TaskCommentType[];
  currentUserId: string;
  onAdd: (content: string) => Promise<void>;
  onReply: (content: string, parentCommentId: string) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function TaskComments({
  comments,
  currentUserId,
  onAdd,
  onReply,
  onEdit,
  onDelete,
}: TaskCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(newComment.trim());
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-foreground">Comments</h2>

      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <TaskComment
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Add a comment..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Add Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}