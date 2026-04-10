import { ALL_MODULES } from '../modules';
import type { RepoConfig } from '../modules/types';
import { SnippetBlock } from './SnippetBlock';

interface Props {
  config: RepoConfig;
}

function getLanguage(id: string): string {
  const map: Record<string, string> = {
    npm: 'ini',
    yarn: 'yaml',
    pnpm: 'ini',
    pip: 'ini',
    maven: 'xml',
    gradle: 'groovy',
    go: 'bash',
    docker: 'json',
  };
  return map[id] ?? 'text';
}

export function SnippetsView({ config }: Props) {
  const selectedModules = ALL_MODULES.filter(m => config.selectedManagers.includes(m.id));

  if (selectedModules.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        Select at least one package manager to see configuration snippets.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {selectedModules.map(mod => (
        <div key={mod.id}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{mod.icon}</span>
            <h3 className="font-semibold text-gray-800">{mod.label}</h3>
            <span className="text-xs text-gray-400 font-mono">{mod.configFileName(config)}</span>
          </div>
          <SnippetBlock
            code={mod.configTemplate(config)}
            language={getLanguage(mod.id)}
            title={mod.configFileName(config)}
          />
        </div>
      ))}
    </div>
  );
}
