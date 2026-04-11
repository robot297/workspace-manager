import type { PackageManagerModule, RepoConfig, NpmRegistryEntry } from './types';

/** Extracts the host+path portion of a URL for use in auth lines, e.g. //nexus.acme.com/npm/ */
function registryAuthPrefix(url: string): string {
  try {
    const parsed = new URL(url);
    return `//${parsed.host}${parsed.pathname}`;
  } catch {
    return `//${url}`;
  }
}

function authLine(entry: { authEnabled: boolean; username: string; token: string }, url: string): string {
  if (!entry.authEnabled) return '';
  const prefix = registryAuthPrefix(url);
  const tokenVal = entry.token ? entry.token : 'YOUR_TOKEN';
  return `\n${prefix}:_authToken=${tokenVal}`;
}

function globalBlock(entry: NpmRegistryEntry): string {
  const url = entry.url || 'https://your-registry.example.com';
  return `registry=${url}${authLine(entry, url)}`;
}

function scopedBlock(entry: NpmRegistryEntry): string {
  const url = entry.url || 'https://your-registry.example.com';
  const scope = entry.scope
    ? (entry.scope.startsWith('@') ? entry.scope : `@${entry.scope}`)
    : '@your-scope';
  return `${scope}:registry=${url}${authLine(entry, url)}`;
}

const configTemplate = (config: RepoConfig): string => {
  const { npmRegistries } = config;

  if (!npmRegistries || npmRegistries.length === 0) {
    // Fallback: legacy single-registry behaviour (no npm registries configured yet)
    const url = config.repoUrl || 'https://your-registry.example.com';
    if (config.scope) {
      const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
      return `${scope}:registry=${url}`;
    }
    return `registry=${url}`;
  }

  const global = npmRegistries.find(r => r.scope === undefined);
  const scoped = npmRegistries.filter(r => r.scope !== undefined);

  const blocks: string[] = [];
  if (global) blocks.push(globalBlock(global));
  for (const entry of scoped) blocks.push(scopedBlock(entry));

  return blocks.join('\n\n');
};

const configFileName = (config: RepoConfig): string => {
  if (config.os === 'windows') return `%USERPROFILE%\\.npmrc`;
  return `~/.npmrc`;
};

function scriptLines(config: RepoConfig): string[] {
  const { npmRegistries } = config;

  if (!npmRegistries || npmRegistries.length === 0) {
    const url = config.repoUrl || 'https://your-registry.example.com';
    if (config.scope) {
      const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
      return [`npm config set "${scope}:registry" "${url}"`];
    }
    return [`npm config set registry "${url}"`];
  }

  const lines: string[] = [];
  const global = npmRegistries.find(r => r.scope === undefined);
  const scoped = npmRegistries.filter(r => r.scope !== undefined);

  if (global) {
    const url = global.url || 'https://your-registry.example.com';
    lines.push(`npm config set registry "${url}"`);
    if (global.authEnabled) {
      const prefix = registryAuthPrefix(url);
      const token = global.token || 'YOUR_TOKEN';
      lines.push(`npm config set "${prefix}:_authToken" "${token}"`);
    }
  }

  for (const entry of scoped) {
    const url = entry.url || 'https://your-registry.example.com';
    const scope = entry.scope!.startsWith('@') ? entry.scope! : `@${entry.scope!}`;
    lines.push(`npm config set "${scope}:registry" "${url}"`);
    if (entry.authEnabled) {
      const prefix = registryAuthPrefix(url);
      const token = entry.token || 'YOUR_TOKEN';
      lines.push(`npm config set "${prefix}:_authToken" "${token}"`);
    }
  }

  return lines;
}

const scriptTemplate = (config: RepoConfig): string => scriptLines(config).join('\n');
const psScriptTemplate = (config: RepoConfig): string => scriptLines(config).join('\n');

export const npmModule: PackageManagerModule = {
  id: 'npm',
  label: 'npm',
  icon: '📦',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure npm to use your internal registry by setting the registry URL in `.npmrc`.',
  supportsScope: true,
};
