## Context

The workstation-setup tool currently models all registry configuration as a flat `RepoConfig` object with a single `repoUrl`, `scope`, `username`, `token`, and `authEnabled` field. The npm module's `configTemplate` function consumes this directly and generates either a global `registry=` line or a single scoped `@scope:registry=` line.

Developers at companies frequently need multiple npm registries configured simultaneously: a global internal proxy (replacing the default npmjs.org) plus one or more scoped registries for specific teams or artifact groups. The current model cannot express this, requiring developers to manually merge multiple tool runs.

The change is npm-specific. All other package managers (pip, gradle, go, docker, yarn, pnpm) retain their existing single-registry model.

## Goals / Non-Goals

**Goals:**
- Allow the npm form to accept one optional global registry and zero or more scoped registry entries
- Each registry entry has independent URL, scope (scoped only), and auth settings
- The npm `configTemplate` generates a complete, merged `.npmrc` covering all entries
- Auth lines use the host-scoped `//hostname/path/:_authToken=` format (more correct than bare `_auth=`)
- UI has a distinct Global Registry section and a Scoped Registries list with add/remove

**Non-Goals:**
- Multi-registry support for other package managers (yarn, pnpm, pip, etc.)
- Preserving or merging with an existing `.npmrc` on the developer's machine
- Serializing multiple registries into shareable URL params (deferred)
- Fallback/priority chain registry resolution

## Decisions

### Decision 1: Introduce a separate `NpmRegistryEntry` type rather than modifying `RepoConfig`

`RepoConfig` is shared across all package managers. Embedding a registry list directly into it would pollute the shared interface and require every module to handle a field irrelevant to it.

**Approach:** Add an `npmRegistries` field of type `NpmRegistryEntry[]` to `RepoConfig`, alongside retaining the existing flat fields for all other managers. The npm module reads `npmRegistries`; all other modules continue reading `repoUrl`, `scope`, etc.

**Alternative considered:** A separate config store per package manager. Rejected — too large a structural change for this scope; the current single-store model is fine.

```ts
interface NpmRegistryEntry {
  id: string;          // stable key for React list rendering
  url: string;
  scope?: string;      // undefined = global entry
  authEnabled: boolean;
  username: string;
  token: string;
}
```

### Decision 2: At most one global entry, enforced by UI (not data model)

A second global `registry=` line in `.npmrc` would silently override the first. Rather than adding validation logic, the UI simply omits the "Add registry" button for the global section — there is exactly one global slot, always visible, URL optional (empty = no global override).

### Decision 3: Auth lines use host-scoped `//host/path/:_authToken=` format

The existing implementation uses `_auth=base64(user:token)` which is a legacy format. The host-scoped token format (`//registry.example.com/:_authToken=TOKEN`) is the correct modern approach and is required for per-registry auth to work correctly in npm.

**Auth line generation:**
```
//hostname/path/:_authToken=YOUR_TOKEN
```
Derived from the registry URL — strip protocol, append `/:_authToken=...`.

### Decision 4: npm config generation becomes a reduce over the registry list

The `configTemplate` function in `npm.ts` changes from a single-config function to one that iterates `config.npmRegistries`, building each block and joining them:

```
global entry block (if url set)
  registry=<url>
  //host/path/:_authToken=TOKEN  (if auth enabled)

per scoped entry:
  @scope:registry=<url>
  //host/path/:_authToken=TOKEN  (if auth enabled)
```

### Decision 5: URL sharing drops npm-specific params for now

The existing `?repo=` and `?scope=` params mapped to the single-registry model. With a list, correct serialization is non-trivial. For this change, npm registries are excluded from URL serialization — the URL sharing feature continues to work for other managers. This is an acceptable trade-off given the "full config tool" mental model (developers build their config in the UI, not via shared links).

## Risks / Trade-offs

- **Breaking change to `RepoConfig`**: Adding `npmRegistries` is additive, but the existing `repoUrl`/`scope` fields will no longer drive npm output. URL params using `?repo=` that auto-populate the npm form will stop working. → Mitigation: Document clearly; acceptable given the scope of the change.
- **Empty state UX**: A developer with no registries configured will see an empty scoped list and an empty global section — the output will be an empty or near-empty `.npmrc`. → Mitigation: Show a placeholder/hint when both sections are empty.
- **Script export compatibility**: The "Export Script" tab uses `npm config set` commands. These need updating to handle multiple registries. → Mitigation: Generate one `npm config set` call per registry entry.

## Open Questions

- Should the global registry slot be pre-populated with a placeholder URL or left completely blank? Blank feels less presumptuous but may confuse first-time users.
- Does the step-by-step guide need updating for multi-registry, or is the snippet view sufficient for this change?
