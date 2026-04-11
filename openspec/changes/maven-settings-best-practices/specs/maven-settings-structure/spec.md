## ADDED Requirements

### Requirement: settings.xml includes mirrors section with correct mirrorOf value
The generated `settings.xml` SHALL include a `<mirrors>` block with a single mirror entry whose `<mirrorOf>` value is `*,!local`, routing all remote repository traffic through the internal mirror while excluding local file-system repositories.

#### Scenario: Mirror block uses *,!local
- **WHEN** the user provides an internal repository URL
- **THEN** the generated `settings.xml` contains a `<mirror>` entry with `<mirrorOf>*,!local</mirrorOf>` and `<url>` set to the provided URL

### Requirement: settings.xml uses environment variable interpolation for credentials
When authentication is enabled, the generated `settings.xml` SHALL reference credentials using Maven's `${env.VAR}` interpolation syntax — specifically `${env.MAVEN_USERNAME}` and `${env.MAVEN_TOKEN}` — rather than literal placeholder strings.

#### Scenario: Credentials use env var interpolation
- **WHEN** the user enables authentication
- **THEN** the generated `<server>` block contains `<username>${env.MAVEN_USERNAME}</username>` and `<password>${env.MAVEN_TOKEN}</password>`

#### Scenario: No credentials section when auth disabled
- **WHEN** the user has authentication disabled
- **THEN** the generated `settings.xml` does not contain a `<servers>` block

### Requirement: settings.xml includes a profile with repositories and pluginRepositories
The generated `settings.xml` SHALL include a `<profiles>` section containing a profile named `internal-repo` that declares both `<repositories>` and `<pluginRepositories>` entries pointing to the internal repository URL, with explicit `<releases>` and `<snapshots>` update policies.

#### Scenario: Profile repositories block present
- **WHEN** the user provides an internal repository URL
- **THEN** the generated `settings.xml` contains a `<profile>` with id `internal-repo` that includes a `<repository>` entry with the provided URL under `<repositories>`

#### Scenario: Profile pluginRepositories block present
- **WHEN** the user provides an internal repository URL
- **THEN** the generated `settings.xml` contains a `<pluginRepository>` entry with the provided URL under the `internal-repo` profile's `<pluginRepositories>`

#### Scenario: Release update policy is daily
- **WHEN** the settings.xml is generated
- **THEN** the `<releases>` block within the profile's repository and pluginRepository entries has `<updatePolicy>daily</updatePolicy>`

#### Scenario: Snapshot update policy is always
- **WHEN** the settings.xml is generated
- **THEN** the `<snapshots>` block within the profile's repository and pluginRepository entries has `<updatePolicy>always</updatePolicy>`

### Requirement: settings.xml activates the internal-repo profile by default
The generated `settings.xml` SHALL include an `<activeProfiles>` section that activates the `internal-repo` profile, ensuring repository routing is in effect without requiring any POM-level activation.

#### Scenario: activeProfiles contains internal-repo
- **WHEN** the settings.xml is generated
- **THEN** the `<activeProfiles>` section contains `<activeProfile>internal-repo</activeProfile>`

### Requirement: settings.xml has proper XML namespace and schema declaration
The generated `settings.xml` SHALL include the standard Maven Settings namespace URI (`http://maven.apache.org/SETTINGS/1.2.0`) and the corresponding `xsi:schemaLocation` attribute on the root `<settings>` element.

#### Scenario: Namespace and schema attributes present on root element
- **WHEN** the settings.xml is generated
- **THEN** the root `<settings>` element includes `xmlns`, `xmlns:xsi`, and `xsi:schemaLocation` attributes matching the Maven Settings 1.2.0 schema
