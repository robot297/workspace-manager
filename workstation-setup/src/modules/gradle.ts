import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-nexus.example.com/repository/maven-public/';
  if (config.authEnabled) {
    const user = config.username ? config.username : 'YOUR_USERNAME';
    const token = config.token ? config.token : 'YOUR_TOKEN';
    return `repositories {
    maven {
        url "${url}"
        credentials {
            username = "${user}"
            password = "${token}"
        }
    }
}`;
  }
  return `repositories {
    maven {
        url "${url}"
    }
}`;
};

const configFileName = (_config: RepoConfig): string => `build.gradle`;

const scriptTemplate = (config: RepoConfig): string => {
  const initFile = `~/.gradle/init.d/internal-repo.gradle`;
  return [
    `mkdir -p ~/.gradle/init.d`,
    `cat > ${initFile} << 'EOF'`,
    `allprojects {`,
    `    buildscript { ${configTemplate(config)} }`,
    `    ${configTemplate(config)}`,
    `}`,
    `EOF`,
  ].join('\n');
};

const psScriptTemplate = (config: RepoConfig): string => {
  const initFile = `$env:USERPROFILE\\.gradle\\init.d\\internal-repo.gradle`;
  return [
    `$gradleDir = "$env:USERPROFILE\\.gradle\\init.d"`,
    `if (-not (Test-Path $gradleDir)) { New-Item -ItemType Directory -Path $gradleDir | Out-Null }`,
    `@'`,
    `allprojects {`,
    `    buildscript { ${configTemplate(config)} }`,
    `    ${configTemplate(config)}`,
    `}`,
    `'@ | Set-Content -Path "${initFile}"`,
  ].join('\n');
};

export const gradleModule: PackageManagerModule = {
  id: 'gradle',
  label: 'Gradle',
  icon: '🐘',
  configTemplate,
  scriptTemplate,
  psScriptTemplate,
  configFileName,
  stepDescription: 'Configure Gradle to use your internal Maven repository via an init script or `build.gradle` repositories block.',
  supportsScope: false,
};
