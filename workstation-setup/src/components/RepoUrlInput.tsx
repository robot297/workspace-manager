interface Props {
  value: string;
  onChange: (value: string) => void;
}

function isValidUrl(url: string): boolean {
  if (!url) return true; // empty is ok (not yet entered)
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function RepoUrlInput({ value, onChange }: Props) {
  const valid = isValidUrl(value);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="repo-url">
        Repository URL
      </label>
      <input
        id="repo-url"
        type="url"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://artifacts.example.com"
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
  );
}
