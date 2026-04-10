import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-pypi.example.com/simple';
  const lines = [
    `[global]`,
    `index-url = ${url}`,
  ];
  if (config.authEnabled) {
    const user = config.username ? config.username : 'YOUR_USERNAME';
    const token = config.token ? config.token : 'YOUR_TOKEN';
    // Embed credentials in the URL as a common pip pattern
    lines.push(`# Or use: ${url.replace('://', `://${user}:${token}@`)}`);
  }
  return lines.join('\n');
};

const configFileName = (config: RepoConfig): string => {
  switch (config.os) {
    case 'windows': return `%APPDATA%\\pip\\pip.ini`;
    case 'macos': return `~/Library/Application Support/pip/pip.conf`;
    default: return `~/.config/pip/pip.conf`;
  }
};

const scriptTemplate = (config: RepoConfig): string => {
  const filePath = configFileName(config);
  return [
    `mkdir -p "$(dirname ${filePath})"`,
    `cat >> ${filePath} << 'EOF'`,
    configTemplate(config),
    `EOF`,
  ].join('\n');
};

const psScriptTemplate = (config: RepoConfig): string => {
  const filePath = `$env:APPDATA\\pip\\pip.ini`;
  return [
    `$pipDir = Split-Path -Parent "${filePath}"`,
    `if (-not (Test-Path $pipDir)) { New-Item -ItemType Directory -Path $pipDir | Out-Null }`,
    `@'`,
    configTemplate(config),
    `'@ | Add-Content -Path "${filePath}"`,
  ].join('\n');
};

export const pipModule: PackageManagerModule = {
  id: 'pip',
  label: 'pip',
  icon: '🐍',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure pip to use your internal PyPI mirror via `pip.conf` / `pip.ini`.',
  supportsScope: false,
};
