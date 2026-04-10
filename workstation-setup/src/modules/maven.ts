import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-nexus.example.com/repository/maven-public/';
  const auth = config.authEnabled
    ? `
  <servers>
    <server>
      <id>internal-mirror</id>
      <username>${config.username ? config.username : 'YOUR_USERNAME'}</username>
      <password>${config.token ? config.token : 'YOUR_TOKEN'}</password>
    </server>
  </servers>`
    : '';
  return `<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0">
  <mirrors>
    <mirror>
      <id>internal-mirror</id>
      <name>Internal Maven Mirror</name>
      <url>${url}</url>
      <mirrorOf>*</mirrorOf>
    </mirror>
  </mirrors>${auth}
</settings>`;
};

const configFileName = (config: RepoConfig): string => {
  if (config.os === 'windows') return `%USERPROFILE%\\.m2\\settings.xml`;
  return `~/.m2/settings.xml`;
};

const scriptTemplate = (config: RepoConfig): string => {
  const filePath = `~/.m2/settings.xml`;
  return [
    `mkdir -p ~/.m2`,
    `cat > ${filePath} << 'EOF'`,
    configTemplate(config),
    `EOF`,
  ].join('\n');
};

const psScriptTemplate = (config: RepoConfig): string => {
  const filePath = `$env:USERPROFILE\\.m2\\settings.xml`;
  return [
    `$m2Dir = "$env:USERPROFILE\\.m2"`,
    `if (-not (Test-Path $m2Dir)) { New-Item -ItemType Directory -Path $m2Dir | Out-Null }`,
    `@'`,
    configTemplate(config),
    `'@ | Set-Content -Path "${filePath}"`,
  ].join('\n');
};

export const mavenModule: PackageManagerModule = {
  id: 'maven',
  label: 'Maven',
  icon: '🏗️',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure Maven to use your internal repository by adding a mirror in `~/.m2/settings.xml`.',
  supportsScope: false,
};
