import { describe, it, expect } from 'vitest';
import { npmModule } from './npm';
import { yarnModule } from './yarn';
import { pnpmModule } from './pnpm';
import { pipModule } from './pip';
import { mavenModule } from './maven';
import { gradleModule } from './gradle';
import { goModule } from './go';
import { dockerModule } from './docker';
import type { RepoConfig } from './types';

const baseConfig: RepoConfig = {
  repoUrl: 'https://artifacts.example.com',
  os: 'linux',
  selectedManagers: [],
  authEnabled: false,
  username: '',
  token: '',
  scope: '',
  npmRegistries: [],
};

const authConfig: RepoConfig = {
  ...baseConfig,
  authEnabled: true,
  username: 'alice',
  token: 'secret123',
};

const scopedConfig: RepoConfig = {
  ...baseConfig,
  scope: '@myorg',
};

// --- npm ---
describe('npm module — legacy single-registry fallback (no npmRegistries)', () => {
  it('generates global registry config', () => {
    const snippet = npmModule.configTemplate(baseConfig);
    expect(snippet).toContain('registry=https://artifacts.example.com');
  });

  it('generates scoped registry config', () => {
    const snippet = npmModule.configTemplate(scopedConfig);
    expect(snippet).toContain('@myorg:registry=https://artifacts.example.com');
    expect(snippet.split('\n').some(l => l.startsWith('registry='))).toBe(false);
  });

  it('generates bash script', () => {
    const script = npmModule.scriptTemplate(baseConfig);
    expect(script).toContain('npm config set registry');
  });

  it('generates powershell script identical to bash for npm', () => {
    expect(npmModule.psScriptTemplate(baseConfig)).toEqual(npmModule.scriptTemplate(baseConfig));
  });
});

describe('npm module — multi-registry', () => {
  const globalOnlyConfig: RepoConfig = {
    ...baseConfig,
    npmRegistries: [
      { id: '__npm_global__', url: 'https://nexus.acme.com/npm/', scope: undefined, authEnabled: false, username: '', token: '' },
    ],
  };

  const scopedOnlyConfig: RepoConfig = {
    ...baseConfig,
    npmRegistries: [
      { id: 'r1', url: 'https://nexus.acme.com/npm/private/', scope: '@acme', authEnabled: false, username: '', token: '' },
    ],
  };

  const globalAndScopedConfig: RepoConfig = {
    ...baseConfig,
    npmRegistries: [
      { id: '__npm_global__', url: 'https://nexus.acme.com/npm/', scope: undefined, authEnabled: false, username: '', token: '' },
      { id: 'r1', url: 'https://nexus.acme.com/npm/private/', scope: '@acme', authEnabled: false, username: '', token: '' },
      { id: 'r2', url: 'https://npm.pkg.github.com/', scope: '@design', authEnabled: false, username: '', token: '' },
    ],
  };

  const authGlobalConfig: RepoConfig = {
    ...baseConfig,
    npmRegistries: [
      { id: '__npm_global__', url: 'https://nexus.acme.com/npm/', scope: undefined, authEnabled: true, username: '', token: 'my-token' },
    ],
  };

  const authScopedConfig: RepoConfig = {
    ...baseConfig,
    npmRegistries: [
      { id: 'r1', url: 'https://nexus.acme.com/npm/private/', scope: '@acme', authEnabled: true, username: '', token: 'scoped-token' },
    ],
  };

  it('global-only: generates registry= line', () => {
    const snippet = npmModule.configTemplate(globalOnlyConfig);
    expect(snippet).toContain('registry=https://nexus.acme.com/npm/');
    expect(snippet).not.toContain('@');
  });

  it('scoped-only: generates @scope:registry= line with no global registry=', () => {
    const snippet = npmModule.configTemplate(scopedOnlyConfig);
    expect(snippet).toContain('@acme:registry=https://nexus.acme.com/npm/private/');
    expect(snippet.split('\n').some(l => l.startsWith('registry='))).toBe(false);
  });

  it('global+scoped: global appears first, then scoped entries', () => {
    const snippet = npmModule.configTemplate(globalAndScopedConfig);
    expect(snippet).toContain('registry=https://nexus.acme.com/npm/');
    expect(snippet).toContain('@acme:registry=https://nexus.acme.com/npm/private/');
    expect(snippet).toContain('@design:registry=https://npm.pkg.github.com/');
    const globalIdx = snippet.indexOf('registry=https://nexus.acme.com/npm/');
    const scopedIdx = snippet.indexOf('@acme:registry=');
    expect(globalIdx).toBeLessThan(scopedIdx);
  });

  it('auth on global: uses host-scoped _authToken format', () => {
    const snippet = npmModule.configTemplate(authGlobalConfig);
    expect(snippet).toContain('//nexus.acme.com/npm/:_authToken=my-token');
    expect(snippet).not.toContain('_auth=');
  });

  it('auth on scoped: uses host-scoped _authToken format', () => {
    const snippet = npmModule.configTemplate(authScopedConfig);
    expect(snippet).toContain('//nexus.acme.com/npm/private/:_authToken=scoped-token');
  });

  it('auth disabled: no auth line generated', () => {
    const snippet = npmModule.configTemplate(globalOnlyConfig);
    expect(snippet).not.toContain('_authToken');
  });

  it('auth token placeholder when token is empty', () => {
    const config: RepoConfig = {
      ...baseConfig,
      npmRegistries: [
        { id: '__npm_global__', url: 'https://nexus.acme.com/npm/', scope: undefined, authEnabled: true, username: '', token: '' },
      ],
    };
    const snippet = npmModule.configTemplate(config);
    expect(snippet).toContain('_authToken=YOUR_TOKEN');
  });

  it('script: emits one npm config set per registry', () => {
    const script = npmModule.scriptTemplate(globalAndScopedConfig);
    expect(script).toContain('npm config set registry "https://nexus.acme.com/npm/"');
    expect(script).toContain('npm config set "@acme:registry" "https://nexus.acme.com/npm/private/"');
    expect(script).toContain('npm config set "@design:registry" "https://npm.pkg.github.com/"');
  });
});

// --- yarn ---
describe('yarn module', () => {
  it('generates registry config', () => {
    const snippet = yarnModule.configTemplate(baseConfig);
    expect(snippet).toContain('npmRegistryServer: "https://artifacts.example.com"');
  });

  it('includes auth token when enabled', () => {
    const snippet = yarnModule.configTemplate(authConfig);
    expect(snippet).toContain('npmAuthToken: "secret123"');
  });

  it('generates scoped config', () => {
    const snippet = yarnModule.configTemplate(scopedConfig);
    expect(snippet).toContain('npmScopes:');
    expect(snippet).toContain('myorg:');
  });
});

// --- pnpm ---
describe('pnpm module', () => {
  it('generates registry config', () => {
    const snippet = pnpmModule.configTemplate(baseConfig);
    expect(snippet).toContain('registry=https://artifacts.example.com');
  });

  it('generates scoped config', () => {
    const snippet = pnpmModule.configTemplate(scopedConfig);
    expect(snippet).toContain('@myorg:registry=');
  });

  it('generates bash script with pnpm', () => {
    const script = pnpmModule.scriptTemplate(baseConfig);
    expect(script).toContain('pnpm config set registry');
  });
});

// --- pip ---
describe('pip module', () => {
  it('generates pip.conf with index-url', () => {
    const snippet = pipModule.configTemplate(baseConfig);
    expect(snippet).toContain('[global]');
    expect(snippet).toContain('index-url = https://artifacts.example.com');
  });

  it('uses linux config path on linux', () => {
    expect(pipModule.configFileName(baseConfig)).toBe('~/.config/pip/pip.conf');
  });

  it('uses windows config path on windows', () => {
    expect(pipModule.configFileName({ ...baseConfig, os: 'windows' })).toBe('%APPDATA%\\pip\\pip.ini');
  });

  it('uses macos config path on macos', () => {
    expect(pipModule.configFileName({ ...baseConfig, os: 'macos' })).toContain('Library');
  });
});

// --- maven ---
describe('maven module', () => {
  it('generates settings.xml with mirror', () => {
    const snippet = mavenModule.configTemplate(baseConfig);
    expect(snippet).toContain('<url>https://artifacts.example.com</url>');
    expect(snippet).toContain('<mirrorOf>*</mirrorOf>');
  });

  it('includes credentials when auth enabled', () => {
    const snippet = mavenModule.configTemplate(authConfig);
    expect(snippet).toContain('<username>alice</username>');
    expect(snippet).toContain('<password>secret123</password>');
  });
});

// --- gradle ---
describe('gradle module', () => {
  it('generates repositories block', () => {
    const snippet = gradleModule.configTemplate(baseConfig);
    expect(snippet).toContain('repositories {');
    expect(snippet).toContain('url "https://artifacts.example.com"');
  });

  it('includes credentials when auth enabled', () => {
    const snippet = gradleModule.configTemplate(authConfig);
    expect(snippet).toContain('username = "alice"');
    expect(snippet).toContain('password = "secret123"');
  });
});

// --- go ---
describe('go module', () => {
  it('generates GOPROXY export', () => {
    const snippet = goModule.configTemplate(baseConfig);
    expect(snippet).toContain('GOPROXY="https://artifacts.example.com,direct"');
  });

  it('generates GONOSUMCHECK export', () => {
    const snippet = goModule.configTemplate(baseConfig);
    expect(snippet).toContain('GONOSUMCHECK="artifacts.example.com"');
  });
});

// --- docker ---
describe('docker module', () => {
  it('generates daemon.json with registry-mirrors', () => {
    const snippet = dockerModule.configTemplate(baseConfig);
    const json = JSON.parse(snippet);
    expect(json['registry-mirrors']).toContain('https://artifacts.example.com');
  });

  it('includes host in insecure-registries', () => {
    const snippet = dockerModule.configTemplate(baseConfig);
    const json = JSON.parse(snippet);
    expect(json['insecure-registries']).toContain('artifacts.example.com');
  });

  it('uses linux path on linux', () => {
    expect(dockerModule.configFileName(baseConfig)).toBe('/etc/docker/daemon.json');
  });

  it('uses macos path on macos', () => {
    expect(dockerModule.configFileName({ ...baseConfig, os: 'macos' })).toBe('~/.docker/daemon.json');
  });
});
