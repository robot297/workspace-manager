import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  const lines: string[] = [];
  if (config.scope) {
    const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
    lines.push(`npmScopes:`);
    lines.push(`  ${scope.slice(1)}:`);
    lines.push(`    npmRegistryServer: "${url}"`);
    if (config.authEnabled) {
      lines.push(`    npmAuthToken: "${config.token ? config.token : 'YOUR_TOKEN'}"`);
    }
  } else {
    lines.push(`npmRegistryServer: "${url}"`);
    if (config.authEnabled) {
      lines.push(`npmAuthToken: "${config.token ? config.token : 'YOUR_TOKEN'}"`);
    }
  }
  return lines.join('\n');
};

const configFileName = (config: RepoConfig): string => {
  if (config.os === 'windows') return `%USERPROFILE%\\.yarnrc.yml`;
  return `~/.yarnrc.yml`;
};

const scriptTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  const lines: string[] = [`yarn config set npmRegistryServer "${url}"`];
  if (config.authEnabled) {
    lines.push(`yarn config set npmAuthToken "${config.token ? config.token : 'YOUR_TOKEN'}"`);
  }
  return lines.join('\n');
};

const psScriptTemplate = scriptTemplate;

export const yarnModule: PackageManagerModule = {
  id: 'yarn',
  label: 'Yarn',
  icon: '🧶',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure Yarn Berry (v2+) to use your internal registry via `.yarnrc.yml`.',
  supportsScope: true,
};
