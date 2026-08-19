'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskViewSwitcher } from '@/components/tasks/TaskViewSwitcher';
import { TaskFieldsMenu, type FieldVisibility } from '@/components/tasks/TaskFieldsMenu';
import { TaskFilterMenu } from '@/components/tasks/TaskFilterMenu';
import { TaskSearch } from '@/components/tasks/TaskSearch';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskDeleteModal } from '@/components/tasks/TaskDeleteModal';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import type { Task, TaskQuery, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { useDebounce } from '@/lib/hooks';

const DEFAULT_FIELDS: FieldVisibility = {
  priority: true,
  members: true,
  dueDate: true,
  labels: false,
  status: false,
  reporter: false,
};

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState<TaskQuery>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'board' | 'list'>(viewParam === 'list' ? 'list' : 'board');
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [fields, setFields] = useState<FieldVisibility>(DEFAULT_FIELDS);
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>(undefined);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync view with URL
  useEffect(() => {
    const urlView = searchParams.get('view');
    if (urlView === 'list' || urlView === 'board') {
      setView(urlView);
    }
  }, [searchParams]);

  const handleViewChange = (newView: 'board' | 'list') => {
    setView(newView);
    router.push(`/tasks?view=${newView}`);
  };

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

  // Debounced search
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      search: debouncedSearch || undefined,
    }));
  }, [debouncedSearch]);

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
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setDeleteTaskId(null);
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleFilter = (field: 'status' | 'priority' | 'member' | 'label' | 'dueDate', value: string) => {
    setQuery((prev) => {
      const next = { ...prev };
      if (field === 'status') {
        if (next.status === value) delete next.status;
        else next.status = value as TaskStatus;
      } else if (field === 'priority') {
        if (next.priority === value) delete next.priority;
        else next.priority = value as Task['priority'];
      } else {
        if (next[field] === value) delete next[field];
        else next[field] = value;
      }
      return next;
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await handleUpdate(taskId, { status: newStatus });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDefaultStatus(undefined);
    setModalOpen(true);
  };

  const handleAddTask = (status?: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleModalSubmit = async (input: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      await handleUpdate(editingTask.id, input as UpdateTaskInput);
    } else {
      await handleCreate(input as CreateTaskInput);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteTaskId(id);
  };

  const deleteTaskToDelete = tasks.find((t) => t.id === deleteTaskId);

  return (
    <AppShell>
      <div className="min-h-0 flex-1 overflow-auto">
        {/* Tasks Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
            <TaskViewSwitcher view={view} onViewChange={handleViewChange} />
          </div>
          <div className="flex items-center gap-2">
            <TaskSearch value={searchInput} onChange={setSearchInput} />
            <button
              onClick={() => setFieldsOpen(true)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted"
            >
              Fields
            </button>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted"
            >
              Filter
            </button>
            <button
              onClick={() => handleAddTask()}
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
        {loading && tasks.length === 0 && view === 'board' && (
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

        {loading && tasks.length === 0 && view === 'list' && (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Board View */}
        {!loading && view === 'board' && (
          <div className="flex-1 overflow-auto p-6">
            <TaskBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onAddTask={handleAddTask}
            />
          </div>
        )}

        {/* List View */}
        {!loading && view === 'list' && (
          <div className="p-6">
            <TaskList
              tasks={tasks}
              fields={fields}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onAddTask={handleAddTask}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="h-12 w-12 text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
            <p className="text-sm text-muted-foreground">No tasks found.</p>
            <button
              onClick={() => handleAddTask()}
              className="mt-4 h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              + Add Task
            </button>
          </div>
        )}
      </div>

      {/* Fields Menu Modal */}
      <TaskFieldsMenu
        visible={fieldsOpen}
        onClose={() => setFieldsOpen(false)}
        fields={fields}
        onToggle={(field) => setFields((prev) => ({ ...prev, [field]: !prev[field] }))}
        view={view}
        onViewChange={handleViewChange}
      />

      {/* Filter Menu Modal */}
      <TaskFilterMenu
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        selected={{
          status: query.status,
          priority: query.priority,
          member: query.member,
          label: query.label,
          dueDate: query.dueDate,
        }}
        onSelect={handleFilter}
      />

      {/* Task Modal (Add/Edit) */}
      <TaskModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      <TaskDeleteModal
        visible={deleteTaskId !== null}
        taskTitle={deleteTaskToDelete?.title ?? ''}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={() => deleteTaskId && handleDelete(deleteTaskId)}
      />
    </AppShell>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" /></div>}>
      <TasksContent />
    </Suspense>
  );
}