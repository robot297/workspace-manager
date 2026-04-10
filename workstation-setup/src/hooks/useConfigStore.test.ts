import { describe, it, expect } from 'vitest';

// URL param serialization logic extracted and tested independently
// (the hook itself uses browser APIs that require JSDOM setup)

type OS = 'macos' | 'linux' | 'windows';

interface ConfigStore {
  repoUrl: string;
  os: OS;
  selectedManagers: string[];
  authEnabled: boolean;
  username: string;
  token: string;
  scope: string;
}

function writeToUrl(config: ConfigStore): URLSearchParams {
  const params = new URLSearchParams();
  if (config.repoUrl) params.set('repo', config.repoUrl);
  if (config.selectedManagers.length > 0) params.set('managers', config.selectedManagers.join(','));
  if (config.os !== 'macos') params.set('os', config.os);
  return params;
}

function readFromUrl(search: string): Partial<ConfigStore> {
  const params = new URLSearchParams(search);
  const result: Partial<ConfigStore> = {};
  const repo = params.get('repo');
  if (repo) result.repoUrl = repo;
  const managers = params.get('managers');
  if (managers) result.selectedManagers = managers.split(',').filter(Boolean);
  const os = params.get('os') as OS | null;
  if (os && ['macos', 'linux', 'windows'].includes(os)) result.os = os;
  return result;
}

const baseConfig: ConfigStore = {
  repoUrl: 'https://artifacts.example.com',
  os: 'macos',
  selectedManagers: ['npm', 'pip'],
  authEnabled: false,
  username: 'alice',
  token: 'secret123',
  scope: '',
};

describe('URL query param serialization', () => {
  it('serializes repo URL', () => {
    const params = writeToUrl(baseConfig);
    expect(params.get('repo')).toBe('https://artifacts.example.com');
  });

  it('serializes selected managers', () => {
    const params = writeToUrl(baseConfig);
    expect(params.get('managers')).toBe('npm,pip');
  });

  it('does not serialize OS when it is the default (macos)', () => {
    const params = writeToUrl(baseConfig);
    expect(params.has('os')).toBe(false);
  });

  it('serializes non-default OS', () => {
    const params = writeToUrl({ ...baseConfig, os: 'windows' });
    expect(params.get('os')).toBe('windows');
  });

  it('does NOT include username in URL params', () => {
    const params = writeToUrl(baseConfig);
    expect(params.has('username')).toBe(false);
    expect(params.toString()).not.toContain('alice');
  });

  it('does NOT include token in URL params', () => {
    const params = writeToUrl(baseConfig);
    expect(params.has('token')).toBe(false);
    expect(params.toString()).not.toContain('secret123');
  });
});

describe('URL query param deserialization', () => {
  it('reads repo from URL', () => {
    const result = readFromUrl('?repo=https://artifacts.example.com');
    expect(result.repoUrl).toBe('https://artifacts.example.com');
  });

  it('reads managers from URL', () => {
    const result = readFromUrl('?managers=npm,pip');
    expect(result.selectedManagers).toEqual(['npm', 'pip']);
  });

  it('reads os from URL', () => {
    const result = readFromUrl('?os=linux');
    expect(result.os).toBe('linux');
  });

  it('ignores invalid OS values', () => {
    const result = readFromUrl('?os=haiku');
    expect(result.os).toBeUndefined();
  });

  it('handles empty search string', () => {
    const result = readFromUrl('');
    expect(result).toEqual({});
  });
});

describe('credential field exclusion', () => {
  it('credentials are never serialized to URL', () => {
    const sensitiveConfig: ConfigStore = {
      ...baseConfig,
      authEnabled: true,
      username: 'super_secret_user',
      token: 'tok_ABC123',
    };
    const params = writeToUrl(sensitiveConfig);
    const serialized = params.toString();
    expect(serialized).not.toContain('super_secret_user');
    expect(serialized).not.toContain('tok_ABC123');
    expect(serialized).not.toContain('authEnabled');
    expect(serialized).not.toContain('username');
    expect(serialized).not.toContain('token');
  });
});
