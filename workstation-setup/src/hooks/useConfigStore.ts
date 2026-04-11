import { useState, useEffect, useCallback } from 'react';
import type { RepoConfig, OS, NpmRegistryEntry } from '../modules/types';

export type ConfigStore = RepoConfig;

const DEFAULT_CONFIG: ConfigStore = {
  repoUrl: '',
  os: 'macos',
  selectedManagers: [],
  authEnabled: false,
  username: '',
  token: '',
  scope: '',
  npmRegistries: [],
};

function readFromUrl(): Partial<ConfigStore> {
  const params = new URLSearchParams(window.location.search);
  const result: Partial<ConfigStore> = {};

  const repo = params.get('repo');
  if (repo) result.repoUrl = repo;

  const managers = params.get('managers');
  if (managers) result.selectedManagers = managers.split(',').filter(Boolean);

  const os = params.get('os') as OS | null;
  if (os && (['macos', 'linux', 'windows'] as OS[]).includes(os)) result.os = os;

  return result;
}

/**
 * Serialize non-sensitive config fields to URL query params.
 * Credentials (username, token, authEnabled) are deliberately excluded.
 */
function writeToUrl(config: ConfigStore) {
  const params = new URLSearchParams();
  if (config.repoUrl) params.set('repo', config.repoUrl);
  if (config.selectedManagers.length > 0) params.set('managers', config.selectedManagers.join(','));
  if (config.os !== 'macos') params.set('os', config.os);

  const search = params.toString();
  const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
}

export function useConfigStore() {
  const [config, setConfigRaw] = useState<ConfigStore>(() => ({
    ...DEFAULT_CONFIG,
    ...readFromUrl(),
  }));

  // Write safe fields to URL on change
  useEffect(() => {
    writeToUrl(config);
  }, [config.repoUrl, config.os, config.selectedManagers]); // eslint-disable-line react-hooks/exhaustive-deps

  const setConfig = useCallback((update: Partial<ConfigStore>) => {
    setConfigRaw(prev => ({ ...prev, ...update }));
  }, []);

  const toggleManager = useCallback((id: string) => {
    setConfigRaw(prev => ({
      ...prev,
      selectedManagers: prev.selectedManagers.includes(id)
        ? prev.selectedManagers.filter(m => m !== id)
        : [...prev.selectedManagers, id],
    }));
  }, []);

  const addNpmRegistry = useCallback(() => {
    const entry: NpmRegistryEntry = {
      id: crypto.randomUUID(),
      url: '',
      scope: '',
      authEnabled: false,
      username: '',
      token: '',
    };
    setConfigRaw(prev => ({ ...prev, npmRegistries: [...prev.npmRegistries, entry] }));
  }, []);

  const updateNpmRegistry = useCallback((id: string, update: Partial<NpmRegistryEntry>) => {
    setConfigRaw(prev => ({
      ...prev,
      npmRegistries: prev.npmRegistries.map(r => r.id === id ? { ...r, ...update } : r),
    }));
  }, []);

  const removeNpmRegistry = useCallback((id: string) => {
    setConfigRaw(prev => ({
      ...prev,
      npmRegistries: prev.npmRegistries.filter(r => r.id !== id),
    }));
  }, []);

  /** Upsert the global (no-scope) registry entry, identified by the stable GLOBAL_ID. */
  const setNpmGlobal = useCallback((update: Partial<NpmRegistryEntry>) => {
    const GLOBAL_ID = '__npm_global__';
    setConfigRaw(prev => {
      const existing = prev.npmRegistries.find(r => r.id === GLOBAL_ID);
      if (existing) {
        return {
          ...prev,
          npmRegistries: prev.npmRegistries.map(r => r.id === GLOBAL_ID ? { ...r, ...update } : r),
        };
      }
      const newGlobal: NpmRegistryEntry = {
        id: GLOBAL_ID,
        url: '',
        scope: undefined,
        authEnabled: false,
        username: '',
        token: '',
        ...update,
      };
      return { ...prev, npmRegistries: [newGlobal, ...prev.npmRegistries] };
    });
  }, []);

  return { config, setConfig, toggleManager, addNpmRegistry, updateNpmRegistry, removeNpmRegistry, setNpmGlobal };
}
