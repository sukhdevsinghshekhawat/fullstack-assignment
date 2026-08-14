import { Check, X } from 'lucide-react';
import type { TaskLabel, TaskPriority, TaskStatus } from '@/types/task';

interface TaskFieldsMenuProps {
  visible: boolean;
  onClose: () => void;
  selected: {
    status?: TaskStatus;
    priority?: TaskPriority;
    label?: TaskLabel[];
  };
  onSelect: (field: 'status' | 'priority' | 'label', value: any) => void;
}

export function TaskFieldsMenu({
  visible,
  onClose,
  selected,
  onSelect,
}: TaskFieldsMenuProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 hidden items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="fields-menu-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-transform duration-200 scale-100">
        <h3 id="fields-menu-title" className="text-lg font-semibold text-foreground mb-4">
          Fields
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {/* Status */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <div className="flex gap-2 flex-wrap">
              {['TODO', 'DOING', 'COMPLETED', 'ON_HOLD'].map((status) => (
                <button
                  key={status}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors bg-accent/10 text-accent hover:bg-muted hover:text-foreground"
                  onClick={() => onSelect('status', status as TaskStatus)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1">
              Priority
            </label>
            <div className="flex gap-2 flex-wrap">
              {['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => (
                <button
                  key={priority}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors bg-accent/10 text-accent hover:bg-muted hover:text-foreground"
                  onClick={() => onSelect('priority', priority as TaskPriority)}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground bg-accent">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
