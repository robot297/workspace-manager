## ADDED Requirements

### Requirement: Generate package manager configuration snippets
The system SHALL generate valid, copy-paste-ready configuration snippets for each selected package manager based on the provided repository URL, optional credential placeholders, and optional scope/group filter.

#### Scenario: npm registry configuration generated
- **WHEN** a user selects npm and provides a repository URL
- **THEN** the system generates a `.npmrc` snippet that sets the registry to the provided URL

#### Scenario: Scoped npm registry configuration
- **WHEN** a user selects npm, provides a repository URL, and specifies an npm scope (e.g., `@myorg`)
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
