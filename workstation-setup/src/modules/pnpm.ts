import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  const lines: string[] = [];
  if (config.scope) {
    const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
    lines.push(`${scope}:registry=${url}`);
  } else {
    lines.push(`registry=${url}`);
  }
  if (config.authEnabled) {
    lines.push(`//$(echo "${url}" | sed 's|https\\?://||'):_authToken=${config.token ? config.token : 'YOUR_TOKEN'}`);
  }
  return lines.join('\n');
};

const configFileName = (config: RepoConfig): string => {
  if (config.os === 'windows') return `%USERPROFILE%\\.npmrc`;
  return `~/.npmrc`;
};

const scriptTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  if (config.scope) {
    const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
    return `pnpm config set "${scope}:registry" "${url}"`;
  }
  return `pnpm config set registry "${url}"`;
};

const psScriptTemplate = scriptTemplate;

export const pnpmModule: PackageManagerModule = {
  id: 'pnpm',
  label: 'pnpm',
  icon: '⚡',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure pnpm to use your internal registry via `.npmrc`.',
  supportsScope: true,
};
