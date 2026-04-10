# Workstation Package Manager Setup

A static, client-side web app that generates configuration snippets and setup scripts for configuring local package managers to use an internal artifact repository (Nexus, Artifactory, AWS CodeArtifact, GitHub Packages, etc.).

## Features

- **8 package managers**: npm, Yarn, pnpm, pip, Maven, Gradle, Go modules, Docker
- **3 output modes**: Config snippets, step-by-step guide, downloadable shell script
- **OS-aware**: macOS, Linux, Windows paths and commands
- **Shareable links**: Non-sensitive settings sync to URL query params
- **Privacy first**: Credentials never leave the browser

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`. Serve from any static host (Nginx, Apache, GitHub Pages, S3, intranet).

## Deploy to a sub-path

If your app is served at `/tools/setup/` instead of the root:

```bash
BASE_URL=/tools/setup/ npm run build
```

This sets the Vite `base` option so all asset URLs are relative to the sub-path.

## Deploy options

### GitHub Pages

```bash
npm run build
# Push dist/ to the gh-pages branch, or use the gh-pages npm package
```

### Nginx

```nginx
server {
    listen 80;
    root /var/www/workstation-setup/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Any static host (S3, intranet, CDN)

Upload the contents of `dist/` to the host. The app is fully self-contained with no backend requirements.

## Tests

```bash
npm test
```
