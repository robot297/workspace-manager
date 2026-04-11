## ADDED Requirements

### Requirement: Configure multiple npm registries
The system SHALL allow users to configure multiple npm registries consisting of one optional global registry and zero or more scoped registries, each with independent URL, scope, and authentication settings.

#### Scenario: Add a global registry
- **WHEN** a user enters a URL in the Global Registry section without a scope
- **THEN** the system stores a global registry entry with that URL

#### Scenario: Add a scoped registry
- **WHEN** a user enters a URL and scope in the Scoped Registries section
- **THEN** the system stores a scoped registry entry with that URL and scope

#### Scenario: Add multiple scoped registries
- **WHEN** a user clicks "Add registry" and fills in a second scoped registry entry
- **THEN** the system stores both scoped registry entries independently

#### Scenario: Remove a scoped registry
- **WHEN** a user clicks the remove button on a scoped registry entry
- **THEN** that entry is removed from the list and no longer appears in the generated output

#### Scenario: Global registry is optional
- **WHEN** a user configures only scoped registries with no global registry URL
- **THEN** the system generates a valid `.npmrc` with only the scoped registry entries

### Requirement: Independent auth per registry
The system SHALL allow each registry entry (global or scoped) to have its own independent authentication configuration, including enabling/disabling auth and specifying credentials per registry.

#### Scenario: Auth enabled on global registry only
- **WHEN** a user enables auth on the global registry but not on any scoped registry
- **THEN** only the global registry block in the generated `.npmrc` contains auth lines

#### Scenario: Auth enabled on a scoped registry
- **WHEN** a user enables auth on a scoped registry entry and provides a token
- **THEN** the generated `.npmrc` contains an auth line scoped to that registry's hostname

#### Scenario: Different auth per scoped registry
- **WHEN** a user configures two scoped registries each with different tokens
- **THEN** the generated `.npmrc` contains separate auth lines for each registry host

### Requirement: Complete .npmrc output
The system SHALL generate a single, complete `.npmrc` file that combines all configured registry entries, suitable for replacing the developer's existing `.npmrc` in its entirety.

#### Scenario: Global and scoped registries combined
- **WHEN** a user has configured a global registry and two scoped registries
- **THEN** the generated `.npmrc` contains the global `registry=` line followed by all scoped `@scope:registry=` lines and their respective auth lines

#### Scenario: Output order is global first then scoped
- **WHEN** the user has both a global and scoped registries configured
- **THEN** the global registry entry appears first in the generated `.npmrc`, followed by scoped entries
