import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-goproxy.example.com';
  return `export GOPROXY="${url},direct"
export GONOSUMCHECK="${url.replace(/^https?:\/\//, '')}"
export GONOSUMDB="${url.replace(/^https?:\/\//, '')}"`;
};

const configFileName = (config: RepoConfig): string => {
  if (config.os === 'windows') return `$PROFILE (PowerShell profile)`;
  return `~/.bashrc or ~/.zshrc`;
};

const scriptTemplate = (config: RepoConfig): string => {
  const snippet = configTemplate(config);
  return [
    `# Add to your shell profile (~/.bashrc or ~/.zshrc)`,
    snippet,
    ``,
    `# Apply immediately`,
    `${snippet.split('\n').join('; ')}`,
  ].join('\n');
};

const psScriptTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-goproxy.example.com';
  const host = url.replace(/^https?:\/\//, '');
  return [
    `$env:GOPROXY = "${url},direct"`,
    `$env:GONOSUMCHECK = "${host}"`,
    `$env:GONOSUMDB = "${host}"`,
  ].join('\n');
};

export const goModule: PackageManagerModule = {
  id: 'go',
  label: 'Go modules',
  icon: '🐹',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure Go to use your internal proxy by setting `GOPROXY`, `GONOSUMCHECK`, and `GONOSUMDB` environment variables.',
  supportsScope: false,
};
