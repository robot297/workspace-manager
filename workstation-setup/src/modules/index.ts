export type { PackageManagerModule, RepoConfig, OS } from './types';
export { npmModule } from './npm';
export { yarnModule } from './yarn';
export { pnpmModule } from './pnpm';
export { pipModule } from './pip';
export { mavenModule } from './maven';
export { gradleModule } from './gradle';
export { goModule } from './go';
export { dockerModule } from './docker';

import { npmModule } from './npm';
import { yarnModule } from './yarn';
import { pnpmModule } from './pnpm';
import { pipModule } from './pip';
import { mavenModule } from './maven';
import { gradleModule } from './gradle';
import { goModule } from './go';
import { dockerModule } from './docker';
import type { PackageManagerModule } from './types';

export const ALL_MODULES: PackageManagerModule[] = [
  npmModule,
  yarnModule,
  pnpmModule,
  pipModule,
  mavenModule,
  gradleModule,
  goModule,
  dockerModule,
];
