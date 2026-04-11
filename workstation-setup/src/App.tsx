import { useState } from 'react';
import { useConfigStore } from './hooks/useConfigStore';
import { PackageManagerSelector } from './components/PackageManagerSelector';
import { OsSelector } from './components/OsSelector';
import { RepoUrlInput } from './components/RepoUrlInput';
import { AuthFields } from './components/AuthFields';
import { ScopeInput } from './components/ScopeInput';
import { NpmRegistryConfig } from './components/NpmRegistryConfig';
import { SnippetsView } from './components/SnippetsView';
import { InstructionStepper } from './components/InstructionStepper';
import { ScriptExportPanel } from './components/ScriptExportPanel';
import { ALL_MODULES } from './modules';
import type { OS } from './modules/types';
import { ShieldCheck } from 'lucide-react';

type Tab = 'snippets' | 'steps' | 'export';

const TABS: { id: Tab; label: string }[] = [
  { id: 'snippets', label: 'Snippets' },
  { id: 'steps', label: 'Step-by-Step Guide' },
  { id: 'export', label: 'Export Script' },
];

export default function App() {
  const { config, setConfig, toggleManager, addNpmRegistry, updateNpmRegistry, removeNpmRegistry, setNpmGlobal } = useConfigStore();
  const [activeTab, setActiveTab] = useState<Tab>('snippets');

  const npmSelected = config.selectedManagers.includes('npm');

  // Show scope input if any non-npm selected manager supports it
  const showScope = ALL_MODULES
    .filter(m => config.selectedManagers.includes(m.id) && m.id !== 'npm')
    .some(m => m.supportsScope);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Workstation Package Manager Setup</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure your local package managers to use an internal artifact repository
          </p>
        </div>
      </header>

      {/* Security notice */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-blue-800 text-sm">
          <ShieldCheck size={16} className="flex-shrink-0" />
          <span>
            <strong>Privacy guaranteed:</strong> All configuration is generated in your browser.
            Credentials are never stored, transmitted, or logged.
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-6">

          {/* Left panel: Configuration form */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
              <PackageManagerSelector
                selected={config.selectedManagers}
                onToggle={toggleManager}
              />

              <hr className="border-gray-100" />

              <OsSelector
                value={config.os}
                onChange={(os: OS) => setConfig({ os })}
              />

              <hr className="border-gray-100" />

              {npmSelected && (
                <>
                  <NpmRegistryConfig
                    npmRegistries={config.npmRegistries}
                    onUpdate={updateNpmRegistry}
                    onAdd={addNpmRegistry}
                    onRemove={removeNpmRegistry}
                    onGlobalChange={setNpmGlobal}
                  />
                  {config.selectedManagers.length > 1 && <hr className="border-gray-100" />}
                </>
              )}

              {config.selectedManagers.filter(id => id !== 'npm').length > 0 && (
                <>
                  <RepoUrlInput
                    value={config.repoUrl}
                    onChange={repoUrl => setConfig({ repoUrl })}
                  />

                  <ScopeInput
                    value={config.scope}
                    onChange={scope => setConfig({ scope })}
                    visible={showScope}
                  />

                  <AuthFields
                    authEnabled={config.authEnabled}
                    username={config.username}
                    token={config.token}
                    onAuthEnabledChange={authEnabled => setConfig({ authEnabled })}
                    onUsernameChange={username => setConfig({ username })}
                    onTokenChange={token => setConfig({ token })}
                  />
                </>
              )}

              {config.selectedManagers.length === 0 && (
                <RepoUrlInput
                  value={config.repoUrl}
                  onChange={repoUrl => setConfig({ repoUrl })}
                />
              )}
            </div>

            {/* Share link hint */}
            <p className="text-xs text-gray-400 text-center">
              The URL updates as you configure — share it to pre-fill the form (credentials excluded).
            </p>
          </aside>

          {/* Right panel: Output */}
          <main className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-5">
              {activeTab === 'snippets' && <SnippetsView config={config} />}
              {activeTab === 'steps' && <InstructionStepper config={config} />}
              {activeTab === 'export' && <ScriptExportPanel config={config} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
