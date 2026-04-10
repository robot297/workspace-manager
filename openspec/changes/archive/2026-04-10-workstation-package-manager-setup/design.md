## Context

Organizations that host internal artifact repositories (Nexus, Artifactory, AWS CodeArtifact, GitHub Packages, etc.) require developers to manually configure each package manager on their workstations. This is a multi-step process that varies by OS, package manager, and auth mechanism. The goal is a static, client-side web app that asks a developer a few questions and then produces copy-paste-ready configuration snippets and an optional shell script.

No existing system is being modified. The app is net-new.

## Goals / Non-Goals

**Goals:**
- Static, zero-backend web application (deployable to any static host or intranet)
- Support the most common package managers: npm/yarn/pnpm, pip/uv, Maven, Gradle, Go modules, Docker/OCI
- Accept repository URL, optional credential template (username/token placeholders), and scope/group filters
- Generate per-package-manager configuration snippets with syntax highlighting
- Allow users to download a shell script that applies all selected configurations automatically
- Step-by-step guided view for developers who prefer manual setup

**Non-Goals:**
- Storing or transmitting credentials (all config generation is client-side only)
- Connecting to or validating the artifact repository at runtime
- Supporting every package manager that exists (scope limited to common ones listed above)
- Authentication against the app itself (no login required)

## Decisions

### Decision 1: Fully Static / Client-Side Only

**Choice**: Pure static SPA (React + Vite), no backend.

**Rationale**: The app only needs to template strings based on user input. A backend would add operational overhead, a security surface for credential handling, and deployment complexity. Client-side generation means credentials never leave the browser.

**Alternatives considered**:
- Server-side rendering (Next.js): rejected — adds server dependency without benefit
- Backend API that generates scripts: rejected — unnecessary; increases credential exposure risk

---

### Decision 2: Component-per-Package-Manager

**Choice**: Each package manager is modeled as a self-contained configuration module (a TypeScript object with metadata, config template function, and script template function).

**Rationale**: New package managers can be added without touching core logic. Each module encapsulates its own config syntax (`.npmrc`, `pip.conf`, `settings.xml`, etc.) and shell commands.

**Alternatives considered**:
- Single generic template engine: harder to maintain per-manager quirks and auth flows
- JSON/YAML config files loaded at runtime: adds indirection with no user benefit

---

### Decision 3: No Persistence / No State Management Library

**Choice**: React component state + URL query params for shareable links. No Redux/Zustand.

**Rationale**: The form is a linear wizard; global state is overkill. URL params allow users to share pre-filled links (e.g., a DevOps team can publish a link with the repo URL pre-populated).

**Alternatives considered**:
- localStorage: could persist settings between sessions, but adds complexity and could accidentally store credentials
- Redux: unnecessary for a single-page wizard

---

### Decision 4: Shell Script Generation in Browser

**Choice**: Generate a Bash script (Linux/macOS) and a PowerShell script (Windows) client-side using template literals, offered as downloadable blobs.

**Rationale**: Separating OS targets (Bash vs PowerShell) covers the two dominant developer environments. Combining them into one script adds complexity with minimal gain.

**Alternatives considered**:
- Single cross-platform script (PowerShell Core): good cross-platform coverage but less familiar to Linux/macOS developers

## Risks / Trade-offs

- **Credential placeholder confusion** → Mitigation: Clearly label all credential fields as "template placeholders" and add a prominent warning that credentials should be stored in a secrets manager or OS keychain, not in plaintext config files.
- **Package manager version drift** → Mitigation: Version-specific config differences (e.g., npm v7 vs v9 registry scopes) should be documented in module metadata; the UI can surface version caveats.
- **URL query param credential leakage** → Mitigation: Credentials are excluded from URL serialization; only non-sensitive fields (repo URL, selected package managers) are put in query params.
- **Browser compatibility** → Mitigation: Target evergreen browsers; use standard Web APIs (Blob, URL.createObjectURL) for file download.
