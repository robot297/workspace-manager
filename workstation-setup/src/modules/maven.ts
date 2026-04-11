import type { PackageManagerModule, RepoConfig } from './types';

const configTemplate = (config: RepoConfig): string => {
  const url = config.repoUrl || 'https://your-nexus.example.com/repository/maven-public/';
  const servers = config.authEnabled
    ? `
  <servers>
    <server>
      <id>internal-mirror</id>
      <username>\${env.MAVEN_USERNAME}</username>
      <password>\${env.MAVEN_TOKEN}</password>
    </server>
    <server>
      <id>internal-repo</id>
      <username>\${env.MAVEN_USERNAME}</username>
      <password>\${env.MAVEN_TOKEN}</password>
    </server>
  </servers>`
    : '';
  return `<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0
                              https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <mirrors>
    <mirror>
      <id>internal-mirror</id>
      <name>Internal Maven Mirror</name>
      <url>${url}</url>
      <mirrorOf>*,!local</mirrorOf>
    </mirror>
  </mirrors>${servers}
  <profiles>
    <profile>
      <id>internal-repo</id>
      <repositories>
        <repository>
          <id>internal-repo</id>
          <url>${url}</url>
          <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
          </releases>
          <snapshots>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
          </snapshots>
        </repository>
      </repositories>
      <pluginRepositories>
        <pluginRepository>
          <id>internal-repo</id>
          <url>${url}</url>
          <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
          </releases>
          <snapshots>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
          </snapshots>
        </pluginRepository>
      </pluginRepositories>
    </profile>
  </profiles>
  <activeProfiles>
    <activeProfile>internal-repo</activeProfile>
  </activeProfiles>
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
