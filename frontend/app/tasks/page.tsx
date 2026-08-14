'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import type { Task, TaskQuery, CreateTaskInput, UpdateTaskInput } from '@/types/task';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState<TaskQuery>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(query);
      setTasks(data);
    } catch (err) {
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (input: CreateTaskInput) => {
    try {
      const newTask = await createTask(input);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleUpdate = async (id: string, input: UpdateTaskInput) => {
    try {
      const updated = await updateTask(id, input);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleSearch = (search: string) => {
    setQuery((prev) => ({ ...prev, search: search || undefined }));
  };

  const handleFilter = (filter: Partial<TaskQuery>) => {
    setQuery((prev) => ({ ...prev, ...filter }));
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await handleUpdate(taskId, { status: newStatus });
  };

  return (
    <AppShell>
      <div className="min-h-0 flex-1 overflow-auto">
        {/* Tasks Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={query.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 rounded-lg border border-border bg-background px-3 pl-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <button
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted"
            >
              Fields
            </button>
            <button
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted"
            >
              Filter
            </button>
            <button
              onClick={() => handleCreate({ title: 'New Task' })}
              className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <button
              onClick={fetchTasks}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && tasks.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="h-6 w-24 bg-muted rounded" />
                <div className="h-32 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Board */}
        {!loading && tasks.length === 0 && !error && (
          <div className="flex-1 overflow-auto p-6">
            <TaskBoard collapsed={false} />
          </div>
        )}

        {!loading && tasks.length > 0 && !error && (
          <div className="flex-1 overflow-auto p-6">
            <TaskBoard collapsed={false} />
          </div>
        )}
      </div>
    </AppShell>
  );
}