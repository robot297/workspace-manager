import type { OS } from '../modules/types';

interface Props {
  value: OS;
  onChange: (os: OS) => void;
}

const OPTIONS: { value: OS; label: string; icon: string }[] = [
  { value: 'macos', label: 'macOS', icon: '' },
  { value: 'linux', label: 'Linux', icon: '🐧' },
  { value: 'windows', label: 'Windows', icon: '🪟' },
];

export function OsSelector({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Operating System</h2>
      <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2
              ${value === opt.value
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              } border-r border-gray-200 last:border-r-0`}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
