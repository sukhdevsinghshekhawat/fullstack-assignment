import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { getTasks } from '@/lib/tasks';
import { useDebounce } from '@/lib/hooks';

interface TaskSearchProps {
  visible: boolean;
  onClose: () => void;
}

export function TaskSearch({ visible, onClose }: TaskSearchProps) {
  const [query, setQuery] = useState('');
  const { theme } = useTheme();

  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      onClose();
      return;
    }
    // Perform search
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 hidden items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-transform duration-200 scale-100">
        <h3 id="search-dialog-title" className="text-lg font-semibold text-foreground mb-4">
          Search
        </h3>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-md px-3 py-2 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" onClick={onClose} aria-label="Close search" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={handleSearch} className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground bg-accent">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}