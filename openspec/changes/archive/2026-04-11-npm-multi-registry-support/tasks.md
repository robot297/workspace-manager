## 1. Data Model

- [x] 1.1 Add `NpmRegistryEntry` interface to `src/modules/types.ts` with fields: `id`, `url`, `scope?`, `authEnabled`, `username`, `token`
- [x] 1.2 Add `npmRegistries: NpmRegistryEntry[]` field to `RepoConfig` in `src/modules/types.ts`
- [x] 1.3 Update `DEFAULT_CONFIG` in `src/hooks/useConfigStore.ts` to include `npmRegistries: []`
- [x] 1.4 Add store actions for registry list management: `addNpmRegistry`, `updateNpmRegistry`, `removeNpmRegistry`

## 2. npm Config Generation

- [x] 2.1 Rewrite `configTemplate` in `src/modules/npm.ts` to iterate over `config.npmRegistries` and produce a merged `.npmrc` string
- [x] 2.2 Implement global registry block generation: `registry=<url>` + host-scoped auth line (`//host/path/:_authToken=TOKEN`)
- [x] 2.3 Implement scoped registry block generation: `@scope:registry=<url>` + host-scoped auth line per entry
- [x] 2.4 Update `scriptTemplate` in `src/modules/npm.ts` to emit one `npm config set` call per registry entry
- [x] 2.5 Update `psScriptTemplate` in `src/modules/npm.ts` to match `scriptTemplate` changes

## 3. UI — Global Registry Section

- [x] 3.1 Create `NpmGlobalRegistryInput` component with URL field and collapsible auth fields (username + token)
- [x] 3.2 Wire `NpmGlobalRegistryInput` into the npm-specific portion of the config form, replacing the existing `RepoUrlInput` for npm

## 4. UI — Scoped Registries List

- [x] 4.1 Create `NpmScopedRegistryEntry` component: scope field, URL field, auth toggle with username/token fields, remove button
- [x] 4.2 Create `NpmScopedRegistryList` component: renders list of `NpmScopedRegistryEntry` items plus an "Add registry" button
- [x] 4.3 Wire `NpmScopedRegistryList` into the config form, below the global registry section
- [x] 4.4 Implement add: appends a new empty `NpmRegistryEntry` (with generated `id`) to `npmRegistries`
- [x] 4.5 Implement remove: filters the entry by `id` from `npmRegistries`
- [x] 4.6 Add empty-state hint when both global URL is blank and scoped list is empty

## 5. Form Integration

- [x] 5.1 Conditionally render npm multi-registry UI only when npm is a selected manager (hide global `RepoUrlInput` and `ScopeInput` for npm)
- [x] 5.2 Ensure non-npm managers continue using the existing `RepoUrlInput` and `ScopeInput` unchanged

## 6. Tests & Verification

- [x] 6.1 Update or add unit tests for `configTemplate` in npm module covering: global-only, scoped-only, global+scoped, auth variations
- [x] 6.2 Verify the snippet view renders correctly for all registry combinations
- [x] 6.3 Verify the export script tab generates correct `npm config set` commands for multiple registries
- [x] 6.4 Verify other package managers (pip, gradle, etc.) are unaffected
