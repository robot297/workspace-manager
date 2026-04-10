import type { PackageManagerModule, RepoConfig } from './types';

const authLine = (config: RepoConfig) =>
  config.authEnabled
    ? `\n_auth=${config.username ? config.username : 'YOUR_USERNAME'}:${config.token ? config.token : 'YOUR_TOKEN'}`
    : '';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  if (config.scope) {
    const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
    return `${scope}:registry=${url}${authLine(config)}`;
  }
  return `registry=${url}${authLine(config)}`;
};

const configFileName = (config: RepoConfig): string => {
  if (config.os === 'windows') return `%USERPROFILE%\\.npmrc`;
  return `~/.npmrc`;
};

const scriptTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  if (config.scope) {
    const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
    return `npm config set "${scope}:registry" "${url}"`;
  }
  return `npm config set registry "${url}"`;
};

const psScriptTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  if (config.scope) {
    const scope = config.scope.startsWith('@') ? config.scope : `@${config.scope}`;
    return `npm config set "${scope}:registry" "${url}"`;
  }
  return `npm config set registry "${url}"`;
};

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
