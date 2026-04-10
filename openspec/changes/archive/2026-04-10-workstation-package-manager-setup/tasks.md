## 1. Project Scaffolding

- [x] 1.1 Initialize Vite + React + TypeScript project (`npm create vite@latest`)
- [x] 1.2 Add dependencies: `tailwindcss`, `react-syntax-highlighter`, `lucide-react`
- [x] 1.3 Configure Tailwind CSS and base styles
- [x] 1.4 Set up project folder structure: `src/modules/`, `src/components/`, `src/hooks/`

## 2. Package Manager Module System

- [x] 2.1 Define the `PackageManagerModule` TypeScript interface (id, label, icon, configTemplate fn, scriptTemplate fn)
- [x] 2.2 Implement `npm` module: `.npmrc` snippet + Bash/PowerShell setup commands, scoped registry support
- [x] 2.3 Implement `yarn` module: `.yarnrc.yml` snippet + setup commands
- [x] 2.4 Implement `pnpm` module: `.npmrc` snippet with pnpm registry config
- [x] 2.5 Implement `pip` module: `pip.conf` / `pip.ini` snippet, OS-aware paths
- [x] 2.6 Implement `maven` module: `settings.xml` mirror block snippet
- [x] 2.7 Implement `gradle` module: `build.gradle` repositories block snippet
- [x] 2.8 Implement `go` module: `GOPROXY` / `GONOSUMCHECK` export statements
- [x] 2.9 Implement `docker` module: `daemon.json` registry mirrors snippet

## 3. Configuration Form & State

- [x] 3.1 Create `useConfigStore` hook (React state) for: repoUrl, os, selectedManagers, authEnabled, username, token, scope
- [x] 3.2 Implement URL query param sync: read `?repo=` and `?managers=` on mount, write non-sensitive fields to URL on change
- [x] 3.3 Ensure credential fields (`username`, `token`) are never written to URL query params

## 4. Package Manager Selector UI

- [x] 4.1 Build `PackageManagerCard` component (icon, label, selected state toggle)
- [x] 4.2 Build `PackageManagerSelector` grid component rendering all available modules
- [x] 4.3 Build `OsSelector` segmented control (macOS / Linux / Windows)

## 5. Repository Config Generator UI

- [x] 5.1 Build `RepoUrlInput` component with live validation (must be a valid URL)
- [x] 5.2 Build `AuthFields` component (toggle to enable, username + token inputs) with placeholder-only labeling
- [x] 5.3 Build `ScopeInput` component (optional scope/group field, shown for relevant managers)
- [x] 5.4 Build `SnippetBlock` component: syntax-highlighted code block + copy-to-clipboard button with "Copied!" feedback

## 6. Instruction Stepper UI

- [x] 6.1 Build `InstructionStep` component: step number, title, description, code block, "Mark done" checkbox
- [x] 6.2 Build `InstructionStepper` container that generates ordered steps from selected modules
- [x] 6.3 Add progress indicator (e.g., "3 / 7 steps completed") that updates as steps are marked done

## 7. Setup Script Export

- [x] 7.1 Implement `generateBashScript(config)` function that concatenates all selected module script templates into a single `.sh` script with shebang and `set -euo pipefail`
- [x] 7.2 Implement `generatePowerShellScript(config)` function producing equivalent `.ps1` output
- [x] 7.3 Build `ScriptExportPanel` component: read-only syntax-highlighted preview + "Download Script" button
- [x] 7.4 Wire download button to create a `Blob` and trigger browser file download with correct filename and MIME type

## 8. App Layout & Navigation

- [x] 8.1 Build top-level `App` layout: header, two-column (form left, output right) or single-column responsive layout
- [x] 8.2 Add tabbed or accordion navigation to switch between "Snippets", "Step-by-Step Guide", and "Export Script" views
- [x] 8.3 Add a prominent security notice banner stating credentials are never stored or transmitted

## 9. Testing & Quality

- [x] 9.1 Write unit tests for each package manager module's `configTemplate` and `scriptTemplate` functions
- [x] 9.2 Write unit tests for URL query param serialization/deserialization
- [x] 9.3 Verify credential fields are not included in serialized URL params
- [x] 9.4 Smoke-test the Bash and PowerShell script outputs for correctness on a sample config

## 10. Build & Deployment

- [x] 10.1 Configure Vite build for static output (`vite build`)
- [x] 10.2 Add a `README.md` with deployment instructions (any static host: GitHub Pages, Nginx, S3, intranet server)
- [x] 10.3 Verify the built app works correctly when served from a sub-path (configurable `base` in `vite.config.ts`)
