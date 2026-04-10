interface Props {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function PackageManagerCard({ id, label, icon, selected, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
        ${selected
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }`}
      aria-pressed={selected}
    >
      <span className="text-3xl" role="img" aria-label={label}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      {selected && (
        <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">Selected</span>
      )}
    </button>
  );
}
