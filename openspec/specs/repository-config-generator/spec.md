## ADDED Requirements

### Requirement: Generate package manager configuration snippets
The system SHALL generate valid, copy-paste-ready configuration snippets for each selected package manager based on the provided repository configuration. For npm, the system SHALL generate a complete `.npmrc` that incorporates all configured registries (one optional global and zero or more scoped entries). For all other package managers, generation remains based on a single repository URL, optional credential placeholders, and optional scope/group filter.

#### Scenario: npm multi-registry configuration generated
- **WHEN** a user selects npm and has configured a global registry and one or more scoped registries
- **THEN** the system generates a single `.npmrc` snippet containing the global `registry=` line and all scoped `@scope:registry=` lines with their respective auth blocks

#### Scenario: npm global-only configuration generated
- **WHEN** a user selects npm and has configured only a global registry with no scoped registries
- **THEN** the system generates a `.npmrc` snippet with only the global `registry=` line and its auth block

#### Scenario: npm scoped-only configuration generated
- **WHEN** a user selects npm and has configured only scoped registries with no global registry
- **THEN** the system generates a `.npmrc` snippet containing only the scoped `@scope:registry=` lines and their auth blocks, with no global `registry=` line

#### Scenario: Scoped npm registry configuration
- **WHEN** a user selects npm and provides a repository URL, and specifies an npm scope (e.g., `@myorg`)
- **THEN** the system generates a `.npmrc` snippet that maps only that scope to the provided registry URL

#### Scenario: pip configuration generated
- **WHEN** a user selects pip and provides a repository URL
- **THEN** the system generates a `pip.conf` snippet with `index-url` set to the provided URL

#### Scenario: Maven configuration generated
- **WHEN** a user selects Maven and provides a repository URL
- **THEN** the system generates a `settings.xml` mirror block pointing to the provided URL

#### Scenario: Gradle configuration generated
- **WHEN** a user selects Gradle and provides a repository URL
- **THEN** the system generates a `build.gradle` / `settings.gradle` repositories block pointing to the provided URL

#### Scenario: Go modules proxy configuration generated
- **WHEN** a user selects Go modules and provides a repository URL
- **THEN** the system generates shell export statements setting `GOPATH` proxy and `GONOSUMCHECK` appropriately

#### Scenario: Docker registry configuration generated
- **WHEN** a user selects Docker and provides a repository URL
- **THEN** the system generates a `daemon.json` snippet adding the URL as an insecure or mirror registry as appropriate

### Requirement: Credential placeholder injection
The system SHALL insert clearly labeled placeholder tokens (e.g., `YOUR_USERNAME`, `YOUR_TOKEN`) into configuration snippets whenever authentication fields are non-empty, and SHALL NOT embed actual credential values into generated snippets.

#### Scenario: Auth placeholders included when credentials enabled
- **WHEN** a user enables authentication and enters a username and token
- **THEN** the generated snippet contains `YOUR_USERNAME` and `YOUR_TOKEN` placeholders in the correct locations for that package manager's auth format

#### Scenario: Credentials excluded from URL query params
- **WHEN** a user fills in credential fields and shares or copies the page URL
- **THEN** the URL does NOT contain the credential field values

### Requirement: Live snippet preview
The system SHALL update configuration snippets in real time as the user changes any input field, without requiring a form submission.

#### Scenario: Snippet updates on input change
- **WHEN** the user modifies the repository URL field
- **THEN** all generated snippets update immediately to reflect the new URL

### Requirement: npm auth lines scoped to registry host
The system SHALL generate npm auth lines using the `//hostname/path/:` prefix format, scoped to the specific registry host, rather than using a global `_auth=` line.

#### Scenario: Token auth uses host-scoped format
- **WHEN** a user enables auth with a token for an npm registry at `https://nexus.acme.com/npm/`
- **THEN** the generated `.npmrc` contains `//nexus.acme.com/npm/:_authToken=YOUR_TOKEN` rather than a bare `_auth=` line
