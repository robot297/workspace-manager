import type { NpmRegistryEntry } from '../modules/types';
import { NpmGlobalRegistryInput } from './NpmGlobalRegistryInput';
import { NpmScopedRegistryList } from './NpmScopedRegistryList';

const GLOBAL_ID = '__npm_global__';

const EMPTY_GLOBAL: NpmRegistryEntry = {
  id: GLOBAL_ID,
  url: '',
  scope: undefined,
  authEnabled: false,
  username: '',
  token: '',
};

interface Props {
  npmRegistries: NpmRegistryEntry[];
  onUpdate: (id: string, update: Partial<NpmRegistryEntry>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onGlobalChange: (update: Partial<NpmRegistryEntry>) => void;
}

export function NpmRegistryConfig({ npmRegistries, onUpdate, onAdd, onRemove, onGlobalChange }: Props) {
  const globalEntry = npmRegistries.find(r => r.scope === undefined) ?? EMPTY_GLOBAL;
  const scopedEntries = npmRegistries.filter(r => r.scope !== undefined);

  const isEmpty = !globalEntry.url && scopedEntries.length === 0;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Global Registry</h3>
        <NpmGlobalRegistryInput entry={globalEntry} onChange={onGlobalChange} />
      </div>

      <hr className="border-gray-100" />

      <NpmScopedRegistryList
        entries={scopedEntries}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onRemove={onRemove}
      />

      {isEmpty && (
        <p className="text-xs text-gray-400 text-center italic">
          Configure a global registry, add scoped registries, or both — the generated <code className="font-mono">.npmrc</code> will include everything.
        </p>
      )}
    </div>
  );
}
