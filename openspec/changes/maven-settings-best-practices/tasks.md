## 1. Update configTemplate in maven.ts

- [x] 1.1 Replace the root `<settings>` opening tag with one that includes the Maven Settings 1.2.0 `xmlns`, `xmlns:xsi`, and `xsi:schemaLocation` attributes
- [x] 1.2 Change `<mirrorOf>*</mirrorOf>` to `<mirrorOf>*,!local</mirrorOf>` in the mirror block
- [x] 1.3 Replace the `<username>` and `<password>` credential placeholders with `${env.MAVEN_USERNAME}` and `${env.MAVEN_TOKEN}` interpolation syntax
- [x] 1.4 Add a `<profiles>` section containing a profile named `internal-repo` with a `<repositories>` block pointing to the provided URL, with explicit `<releases>` (`updatePolicy: daily`) and `<snapshots>` (`updatePolicy: always`) policies
- [x] 1.5 Add a `<pluginRepositories>` block to the `internal-repo` profile with the same URL and the same release/snapshot update policies
- [x] 1.6 Add an `<activeProfiles>` section that activates the `internal-repo` profile

## 2. Verify and test

- [x] 2.1 Run the existing module tests (`modules.test.ts`) and confirm they pass
- [x] 2.2 Manually verify the generated XML is well-formed and matches the expected structure by pasting into an XML validator or running `xmllint`
- [x] 2.3 Confirm the PowerShell script template (`psScriptTemplate`) still embeds the updated config correctly on Windows paths
