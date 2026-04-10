import { useState } from 'react';
import { ALL_MODULES } from '../modules';
import type { RepoConfig } from '../modules/types';
import { InstructionStep } from './InstructionStep';

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

export function InstructionStepper({ config }: Props) {
  const selectedModules = ALL_MODULES.filter(m => config.selectedManagers.includes(m.id));
  const [done, setDone] = useState<Record<string, boolean>>({});

  if (selectedModules.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        Select at least one package manager to see setup steps.
      </p>
    );
  }

  const completedCount = selectedModules.filter(m => done[m.id]).length;

  const toggleDone = (id: string) => {
    setDone(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${selectedModules.length > 0 ? (completedCount / selectedModules.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {completedCount} / {selectedModules.length} steps completed
        </span>
      </div>

      {/* Steps */}
      {selectedModules.map((mod, i) => (
        <InstructionStep
          key={mod.id}
          stepNumber={i + 1}
          title={`Configure ${mod.label}`}
          description={mod.stepDescription}
          configFileName={mod.configFileName(config)}
          configSnippet={mod.configTemplate(config)}
          configLanguage={getLanguage(mod.id)}
          scriptSnippet={config.os === 'windows' ? mod.psScriptTemplate(config) : mod.scriptTemplate(config)}
          done={!!done[mod.id]}
          onToggleDone={() => toggleDone(mod.id)}
        />
      ))}
    </div>
  );
}
