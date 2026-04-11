import { describe, it, expect } from 'vitest';
import { generateBashScript, generatePowerShellScript } from './ScriptExportPanel';
import type { RepoConfig } from '../modules/types';

const baseConfig: RepoConfig = {
  repoUrl: 'https://artifacts.example.com',
  os: 'linux',
  selectedManagers: ['npm', 'pip'],
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
  token: 'tok123',
};

describe('generateBashScript', () => {
  it('starts with shebang and set -euo pipefail', () => {
    const script = generateBashScript(baseConfig);
    expect(script.startsWith('#!/usr/bin/env bash')).toBe(true);
    expect(script).toContain('set -euo pipefail');
  });

  it('includes npm section', () => {
    const script = generateBashScript(baseConfig);
    expect(script).toContain('npm');
  });

  it('includes pip section', () => {
    const script = generateBashScript(baseConfig);
    expect(script).toContain('pip');
  });

  it('includes credential placeholders when auth enabled', () => {
    const script = generateBashScript(authConfig);
    expect(script).toContain('USERNAME=');
    expect(script).toContain('TOKEN=');
  });

  it('ends with completion message', () => {
    const script = generateBashScript(baseConfig);
    expect(script).toContain('Setup complete!');
  });

  it('returns placeholder script when no managers selected', () => {
    const script = generateBashScript({ ...baseConfig, selectedManagers: [] });
    expect(script).toContain('#!/usr/bin/env bash');
    expect(script).toContain('No package managers selected');
  });
});

describe('generatePowerShellScript', () => {
  it('includes PowerShell credential vars when auth enabled', () => {
    const script = generatePowerShellScript({ ...authConfig, os: 'windows' });
    expect(script).toContain('$USERNAME');
    expect(script).toContain('$TOKEN');
  });

  it('includes Write-Host completion message', () => {
    const script = generatePowerShellScript({ ...baseConfig, os: 'windows' });
    expect(script).toContain('Write-Host "Setup complete!"');
  });

  it('returns placeholder when no managers selected', () => {
    const script = generatePowerShellScript({ ...baseConfig, selectedManagers: [], os: 'windows' });
    expect(script).toContain('No package managers selected');
  });
});
