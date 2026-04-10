## Why

Developers at organizations with internal artifact repositories struggle to configure their local workstations to pull packages from those repositories instead of (or in addition to) public registries. This setup is tedious, error-prone, and varies by package manager — a guided web app can eliminate onboarding friction and reduce misconfiguration incidents.

## What Changes

- Introduce a new web application that guides developers through configuring their local package managers (npm, pip, Maven, Gradle, Go modules, etc.) to use an internal artifact repository
- The app generates ready-to-use configuration snippets and shell commands tailored to the developer's OS, package manager, and repository URL
- Developers can select their package manager(s), enter their repository details, and receive step-by-step instructions with copy-paste commands
- Optionally, provide a downloadable shell script that automates the entire setup

## Capabilities

### New Capabilities

- `repository-config-generator`: Core capability that generates package manager configuration snippets based on user-selected package managers and repository details (URL, auth type, scope/group)
- `package-manager-selector`: UI flow for selecting one or more package managers and specifying the target OS/environment
- `setup-script-export`: Capability to export the full configuration as a downloadable shell script for automated workstation setup
- `instruction-stepper`: Step-by-step guided instructions view that walks developers through applying each configuration change manually

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

- New standalone web application (no backend required; can be fully static)
- No existing systems affected
- May require integration documentation pointing to the organization's artifact repository (e.g., Nexus, Artifactory, AWS CodeArtifact, GitHub Packages)
- Users will need to supply their internal repository URL and credentials (credentials are never stored — only used to generate config templates)
