export type OS = 'macos' | 'linux' | 'windows';

export interface RepoConfig {
  repoUrl: string;
  os: OS;
  selectedManagers: string[];
  authEnabled: boolean;
  username: string;
  token: string;
  scope: string;
}

export interface PackageManagerModule {
  id: string;
  label: string;
  icon: string;
  /** Returns the config file snippet (e.g. .npmrc content) */
  configTemplate: (config: RepoConfig) => string;
  /** Returns shell commands to apply the config */
  scriptTemplate: (config: RepoConfig) => string;
  /** Returns PowerShell commands to apply the config */
  psScriptTemplate: (config: RepoConfig) => string;
  /** Config file name/path for this manager */
  configFileName: (config: RepoConfig) => string;
  /** Description of what the config step does */
  stepDescription: string;
  /** Whether scope/group field is applicable */
  supportsScope: boolean;
}
