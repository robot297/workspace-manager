import { ALL_MODULES } from '../modules';
import { PackageManagerCard } from './PackageManagerCard';

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export function PackageManagerSelector({ selected, onToggle }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Package Managers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALL_MODULES.map(mod => (
          <PackageManagerCard
            key={mod.id}
            id={mod.id}
            label={mod.label}
            icon={mod.icon}
            selected={selected.includes(mod.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
