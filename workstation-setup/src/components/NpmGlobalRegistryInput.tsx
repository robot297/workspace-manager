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
  onChange: (update: Partial<NpmRegistryEntry>) => void;
}

export function NpmGlobalRegistryInput({ entry, onChange }: Props) {
  const valid = isValidUrl(entry.url);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="npm-global-url">
          Global Registry URL <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="npm-global-url"
          type="url"
          value={entry.url}
          onChange={e => onChange({ url: e.target.value })}
          placeholder="https://nexus.example.com/npm/"
          className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors
            ${valid
              ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              : 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            }`}
        />
        {!valid && (
          <p className="mt-1 text-xs text-red-600">Please enter a valid URL (http:// or https://)</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Replaces the default <code className="font-mono">registry.npmjs.org</code> for all packages
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            id="npm-global-auth"
            type="checkbox"
            checked={entry.authEnabled}
            onChange={e => onChange({ authEnabled: e.target.checked })}
            className="w-4 h-4 accent-indigo-500"
          />
          <label htmlFor="npm-global-auth" className="text-sm font-medium text-gray-700 cursor-pointer">
            Authentication required
          </label>
        </div>

        {entry.authEnabled && (
          <div className="mt-3 space-y-3 pl-6 border-l-2 border-indigo-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="npm-global-token">
                Token <span className="text-gray-400">(placeholder only)</span>
              </label>
              <input
                id="npm-global-token"
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
