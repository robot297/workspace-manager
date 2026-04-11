## Why

Developers at companies often need to pull packages from multiple npm registries simultaneously — a global internal proxy for all packages, plus additional scoped registries for specific teams or organizations. The current tool supports only a single registry entry, forcing developers to manually merge multiple generated snippets into a coherent `.npmrc`, which is error-prone and undermines the tool's value.

## What Changes

- **BREAKING**: The npm registry config input changes from a single flat config (one URL, one scope, one auth) to a structured list of registry entries
- The npm configuration form gains a distinct **Global Registry** section (optional, no scope) and a **Scoped Registries** list (add/remove entries, each with its own URL, scope, and auth)
- The `.npmrc` generator produces a complete, merged file covering all configured registries — intended to fully replace the developer's existing file
- Each registry entry has independent auth settings (token, username/password, or none)
- The URL sharing feature continues to work for basic cases; multi-registry serialization is out of scope for this change

## Capabilities

### New Capabilities
- `npm-multi-registry-config`: Ability to configure multiple npm registries (one optional global + N scoped) and generate a single complete `.npmrc` output

### Modified Capabilities
- `repository-config-generator`: The npm config generation requirements change — from single-registry output to multi-registry output with global and scoped sections

## Impact

- `src/modules/npm.ts` — config generation logic needs to handle a list of registry entries
- `src/modules/types.ts` — `RepoConfig` data model changes; npm-specific registry structure introduced
- `src/hooks/useConfigStore.ts` — state shape changes to support registry list; URL serialization may need updating
- `src/components/` — new or updated UI components for global registry section and scoped registry list (add/remove)
- Existing single-registry URL params (`?repo=...&scope=...`) will no longer map cleanly; handled by scope-limiting what gets serialized
