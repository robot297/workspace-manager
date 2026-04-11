## Context

The Maven module (`workstation-setup/src/modules/maven.ts`) generates a `settings.xml` via a `configTemplate` function. Currently it emits only a `<mirrors>` block and an optional `<servers>` block. The tool's purpose is to help developers quickly configure their local environment to use an internal artifact repository; the generated file is copied verbatim into `~/.m2/settings.xml`.

The gap: a developer following the generated config will have mirror routing set up but will lack:
- a named profile with `<repositories>` / `<pluginRepositories>` entries (needed by some Maven plugins and for repo-level release/snapshot policy control)
- `<activeProfiles>` to automatically enable that profile
- environment-variable-based credential references (instead of literal placeholder strings)
- correct `mirrorOf` value and proper XML schema declaration

## Goals / Non-Goals

**Goals:**
- Emit a `settings.xml` that matches what a senior Java developer would write for a standard corporate setup
- Use `${env.VAR}` interpolation for credentials so the snippet is safe to commit or share
- Include `<profiles>` + `<activeProfiles>` blocks for complete repository routing
- Use `*,!local` for `mirrorOf` to avoid mirroring local file-system repositories
- Add proper XML namespace and `xsi:schemaLocation` attributes

**Non-Goals:**
- Supporting multiple mirrors or multiple profiles in a single generated file
- Generating Maven wrapper (`mvnw`) configuration
- Touching any other package manager module
- Adding new UI controls (no new input fields needed)

## Decisions

### 1. `mirrorOf` value: `*,!local` instead of `*`

Using `*` mirrors every repository including `file://` local repos, which can break offline builds and certain Maven plugins that reference a local staging repo. `*,!local` is the conventional safe value that excludes local file-system repositories while still routing all remote traffic through the mirror.

**Alternative considered:** `central` — only mirrors Maven Central, leaving other remote repos unaffected. Rejected because the intent is to route all traffic through the internal proxy, not just Central.

### 2. Credentials via `${env.VAR}` interpolation

Maven natively supports environment variable interpolation in `settings.xml` with `${env.VAR_NAME}`. Using `${env.MAVEN_USERNAME}` and `${env.MAVEN_TOKEN}` instead of `YOUR_USERNAME` / `YOUR_TOKEN` produces a file that is immediately functional once the env vars are set — and is safe to store in dotfiles or commit to a team repo. The credential placeholder requirement in the existing spec (no actual secrets) is still satisfied: the file itself contains no secret values.

**Alternative considered:** Keep literal placeholder strings. Rejected because they require a manual find-and-replace step and encourage users to embed plaintext credentials in the file.

### 3. Include a `<profile>` with `<repositories>` and `<pluginRepositories>`

The mirror block alone is sufficient for dependency resolution in most cases, but Maven plugin resolution sometimes bypasses mirrors and resolves directly from a repository URL declared in a POM. Adding a profile with both `<repositories>` and `<pluginRepositories>` pointing to the internal repo — and activating it via `<activeProfiles>` — ensures complete routing without relying on every POM declaring its own repo.

Release and snapshot update policies are set explicitly (`<updatePolicy>daily</updatePolicy>` for releases, `<updatePolicy>always</updatePolicy>` for snapshots) so behavior is predictable rather than Maven-version-dependent.

### 4. No new UI inputs

All new sections use data already collected by the tool (URL, auth toggle, username, token). No new fields are needed.

## Risks / Trade-offs

- **`${env.VAR}` requires env var to be set at build time** → Mitigation: document the expected env var names in the generated comment block so users know what to export.
- **Profile routing may conflict with POM-declared repos in some projects** → Mitigation: this is an accepted trade-off for corporate setups; the profile can be disabled project-by-project if needed.
- **Expanding the template increases generated file size** → No meaningful impact; `settings.xml` is a one-time setup file.

## Migration Plan

No migration needed. The change is purely to the content of the generated `settings.xml` string. Existing users who have already copied a generated file are unaffected; they may optionally regenerate and apply a new file.

## Open Questions

None.
