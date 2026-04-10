interface Props {
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
}

export function ScopeInput({ value, onChange, visible }: Props) {
  if (!visible) return null;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="scope-input">
        Scope / Group <span className="text-gray-400">(optional)</span>
      </label>
      <input
        id="scope-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="@myorg or mygroup"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
      <p className="mt-1 text-xs text-gray-500">
        Limit the registry to a specific npm scope (e.g. <code className="font-mono">@myorg</code>) or Maven group
      </p>
    </div>
  );
}
