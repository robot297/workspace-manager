import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  const host = url.replace(/^https?:\/\//, '');
  return JSON.stringify(
    {
      'registry-mirrors': [url],
      'insecure-registries': [host],
    },
    null,
    2
  );
};

const configFileName = (config: RepoConfig): string => {
  switch (config.os) {
    case 'windows': return `%ProgramData%\\docker\\config\\daemon.json`;
    case 'macos': return `~/.docker/daemon.json`;
    default: return `/etc/docker/daemon.json`;
  }
};

const scriptTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-registry.example.com';
  const host = url.replace(/^https?:\/\//, '');
  const filePath = config.os === 'macos' ? '~/.docker/daemon.json' : '/etc/docker/daemon.json';
  const sudo = config.os === 'linux' ? 'sudo ' : '';
  return [
    `# Write Docker daemon config`,
    `${sudo}mkdir -p "$(dirname ${filePath})"`,
    `${sudo}cat > ${filePath} << 'EOF'`,
    JSON.stringify({ 'registry-mirrors': [url], 'insecure-registries': [host] }, null, 2),
    `EOF`,
    ``,
    `# Restart Docker daemon`,
    config.os === 'linux' ? `sudo systemctl restart docker` : `# Restart Docker Desktop from the menu bar`,
  ].join('\n');
};

const psScriptTemplate = (config: RepoConfig): string => {
  const filePath = `$env:ProgramData\\docker\\config\\daemon.json`;
  return [
    `$dockerDir = "$env:ProgramData\\docker\\config"`,
    `if (-not (Test-Path $dockerDir)) { New-Item -ItemType Directory -Path $dockerDir | Out-Null }`,
    `@'`,
    configTemplate(config),
    `'@ | Set-Content -Path "${filePath}"`,
    `# Restart Docker Desktop from the system tray`,
  ].join('\n');
};

export const dockerModule: PackageManagerModule = {
  id: 'docker',
  label: 'Docker',
  icon: '🐳',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure Docker to use your internal registry mirror via `daemon.json`.',
  supportsScope: false,
};
