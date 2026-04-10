## ADDED Requirements

### Requirement: Step-by-step manual setup guide
The system SHALL provide a step-by-step instructions view that walks the developer through applying each configuration change manually, one step at a time, for each selected package manager.

#### Scenario: Steps generated for selected package managers
- **WHEN** a user has selected one or more package managers and clicks "View Step-by-Step Guide"
- **THEN** the system renders an ordered list of steps covering all selected package managers in sequence

#### Scenario: Each step shows exactly what to do
- **WHEN** a step involves editing a file
- **THEN** the step displays the full file path, the exact content to add, and instructions on where to place it within the file

#### Scenario: Each step shows the relevant shell command
- **WHEN** a configuration can be applied via a CLI command (e.g., `npm config set`)
- **THEN** the step displays the exact command to run in a code block

### Requirement: Copy-to-clipboard for each snippet
The system SHALL provide a one-click copy-to-clipboard button on every code block (configuration snippet, command, and script preview).

#### Scenario: Code block copied to clipboard
- **WHEN** a user clicks the copy button adjacent to a code block
- **THEN** the full text of the code block is copied to the system clipboard

#### Scenario: Visual feedback on copy
- **WHEN** the copy action succeeds
- **THEN** the copy button briefly shows a checkmark or "Copied!" label for at least 1.5 seconds before reverting

### Requirement: Progress tracking through steps
The system SHALL allow users to mark individual steps as complete and display overall progress.

#### Scenario: Step marked as complete
- **WHEN** a user clicks the checkbox or "Mark done" control on a step
- **THEN** the step is visually distinguished as completed (e.g., strikethrough or checkmark)

#### Scenario: Progress indicator shown
- **WHEN** at least one step has been marked complete
- **THEN** a progress indicator shows the count of completed steps out of total steps
