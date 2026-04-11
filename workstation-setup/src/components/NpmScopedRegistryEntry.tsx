import { X } from 'lucide-react';
import type { NpmRegistryEntry } from '../modules/types';

function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

interface Props {
  entry: NpmRegistryEntry;
  index: number;
  onChange: (update: Partial<NpmRegistryEntry>) => void;
  onRemove: () => void;
}

export function NpmScopedRegistryEntry({ entry, index, onChange, onRemove }: Props) {
  const valid = isValidUrl(entry.url);

  return (
    <div className="border border-gray-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registry {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove registry"
        >
          <X size={16} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scope
        </label>
        <input
          type="text"
          value={entry.scope ?? ''}
          onChange={e => onChange({ scope: e.target.value })}
          placeholder="@myorg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registry URL
        </label>
        <input
          type="url"
          value={entry.url}
          onChange={e => onChange({ url: e.target.value })}
          placeholder="https://nexus.example.com/npm/private/"
          className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors
            ${valid
              ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              : 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            }`}
        />
        {!valid && (
          <p className="mt-1 text-xs text-red-600">Please enter a valid URL (http:// or https://)</p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            id={`npm-scoped-auth-${entry.id}`}
            type="checkbox"
            checked={entry.authEnabled}
            onChange={e => onChange({ authEnabled: e.target.checked })}
            className="w-4 h-4 accent-indigo-500"
          />
          <label htmlFor={`npm-scoped-auth-${entry.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
            Authentication required
          </label>
        </div>

        {entry.authEnabled && (
          <div className="mt-3 space-y-3 pl-6 border-l-2 border-indigo-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token <span className="text-gray-400">(placeholder only)</span>
              </label>
              <input
                type="password"
                value={entry.token}
                onChange={e => onChange({ token: e.target.value })}
                placeholder="YOUR_TOKEN"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
