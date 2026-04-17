import { Plus } from 'lucide-react';
import type { NpmRegistryEntry } from '../modules/types';
import { NpmScopedRegistryEntry } from './NpmScopedRegistryEntry';

interface Props {
  entries: NpmRegistryEntry[];
  onAdd: () => void;
  onUpdate: (id: string, update: Partial<NpmRegistryEntry>) => void;
  onRemove: (id: string) => void;
}

export function NpmScopedRegistryList({ entries, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Scoped Registries</label>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <Plus size={14} />
          Add registry
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-gray-400 italic">
          No scoped registries. Click "Add registry" to configure a scope-specific registry (e.g. <code className="font-mono">@myorg</code>).
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <NpmScopedRegistryEntry
              key={entry.id}
              entry={entry}
              index={index}
              onChange={update => onUpdate(entry.id, update)}
              onRemove={() => onRemove(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
