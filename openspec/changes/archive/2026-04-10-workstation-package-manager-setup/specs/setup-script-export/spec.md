## ADDED Requirements

### Requirement: Download shell script for automated setup
The system SHALL allow the user to download a shell script that, when executed, applies all selected package manager configurations to the local workstation without manual editing.

#### Scenario: Bash script downloaded for macOS/Linux
- **WHEN** a user with macOS or Linux selected clicks "Download Setup Script"
- **THEN** the browser downloads a `.sh` file containing all necessary commands to write the selected configuration files

#### Scenario: PowerShell script downloaded for Windows
- **WHEN** a user with Windows selected clicks "Download Setup Script"
- **THEN** the browser downloads a `.ps1` file containing equivalent PowerShell commands

#### Scenario: Script includes credential placeholders
- **WHEN** authentication is enabled in the configuration
- **THEN** the downloaded script includes `YOUR_USERNAME` and `YOUR_TOKEN` placeholder variables at the top of the script with comments instructing the user to replace them

#### Scenario: Script is executable
- **WHEN** the Bash script is downloaded
- **THEN** the script begins with a `#!/usr/bin/env bash` shebang and `set -euo pipefail` for safety

### Requirement: Script previewed before download
The system SHALL display the full content of the script to the user in a scrollable code block before they download it, so they can review it.

#### Scenario: Script preview visible before download
- **WHEN** a user opens the Export section
- **THEN** the full script content is rendered in a read-only, syntax-highlighted code block

#### Scenario: Preview updates with configuration changes
- **WHEN** the user modifies any configuration input
- **THEN** the script preview updates in real time to reflect the changes
