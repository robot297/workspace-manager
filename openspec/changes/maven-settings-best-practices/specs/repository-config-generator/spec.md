## MODIFIED Requirements

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
- **THEN** the system generates a `settings.xml` that includes a mirror block with `mirrorOf` set to `*,!local`, a profile named `internal-repo` containing `<repositories>` and `<pluginRepositories>` entries with explicit release and snapshot update policies, and an `<activeProfiles>` section activating that profile

#### Scenario: Gradle configuration generated
- **WHEN** a user selects Gradle and provides a repository URL
- **THEN** the system generates a `build.gradle` / `settings.gradle` repositories block pointing to the provided URL

#### Scenario: Go modules proxy configuration generated
- **WHEN** a user selects Go modules and provides a repository URL
- **THEN** the system generates shell export statements setting `GOPATH` proxy and `GONOSUMCHECK` appropriately

#### Scenario: Docker registry configuration generated
- **WHEN** a user selects Docker and provides a repository URL
- **THEN** the system generates a `daemon.json` snippet adding the URL as an insecure or mirror registry as appropriate
