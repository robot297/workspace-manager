## ADDED Requirements

### Requirement: Multi-select package manager picker
The system SHALL present a list of supported package managers and allow the user to select one or more for configuration generation.

#### Scenario: User selects a single package manager
- **WHEN** a user clicks on a package manager card (e.g., npm)
- **THEN** that package manager is marked as selected and its configuration section becomes visible

#### Scenario: User selects multiple package managers
- **WHEN** a user selects more than one package manager
- **THEN** configuration snippets for all selected managers are displayed simultaneously

#### Scenario: User deselects a package manager
- **WHEN** a user clicks a selected package manager card again
- **THEN** it becomes deselected and its configuration section is removed from the output

### Requirement: Operating system targeting
The system SHALL allow the user to specify their operating system (macOS, Linux, Windows) so that configuration file paths and shell commands in snippets and scripts are appropriate for that OS.

#### Scenario: macOS paths used when macOS selected
- **WHEN** a user selects macOS as their OS
- **THEN** all generated file paths use macOS conventions (e.g., `~/.npmrc`, `~/Library/...`)

#### Scenario: Windows paths used when Windows selected
- **WHEN** a user selects Windows as their OS
- **THEN** all generated file paths use Windows conventions (e.g., `%USERPROFILE%\.npmrc`)

#### Scenario: Linux paths used when Linux selected
- **WHEN** a user selects Linux as their OS
- **THEN** all generated file paths use Linux conventions (e.g., `~/.config/pip/pip.conf`)

### Requirement: URL pre-population via query parameters
The system SHALL read the `repo` query parameter from the page URL on load and pre-populate the repository URL input field with its value, enabling shareable pre-filled links.

#### Scenario: Repository URL pre-filled from query param
- **WHEN** the page loads with a `?repo=https://artifacts.example.com` query parameter
- **THEN** the repository URL field is pre-populated with `https://artifacts.example.com`

#### Scenario: Selected package managers pre-filled from query param
- **WHEN** the page loads with a `?managers=npm,pip` query parameter
- **THEN** npm and pip are pre-selected in the package manager picker
