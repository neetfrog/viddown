# Deployment Guide

This guide covers preparing FetchMeThis for production release.

## Pre-Release Checklist

- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript builds without errors (`npx tsc --noEmit`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Version bumped in `package.json`
- [ ] [CHANGELOG.md](CHANGELOG.md) updated
- [ ] Security audit clean (`npm audit`)
- [ ] Code review completed
- [ ] No breaking API changes (or documented)

## Building Installers

### Windows (NSIS + Portable)
```bash
npm run package:win
```
Outputs to `dist/`:
- `FetchMeThis Setup 1.0.0.exe` — NSIS installer
- `FetchMeThis 1.0.0.exe` — Portable executable

**With Code Signing** (optional):
```bash
set CERT_FILE=path/to/cert.pfx
set CERT_PASS=your_password
npm run package:win
```

### macOS (DMG + ZIP)
```bash
npm run package:mac
```
Outputs to `dist/`:
- `FetchMeThis-1.0.0.dmg` — Disk image
- `FetchMeThis-1.0.0-mac.zip` — Zip archive

**With Notarization** (recommended for App Store):
1. Obtain Apple Developer ID Certificate
2. Update `electron-builder.json` with `identity` and `notarize` config
3. Run `npm run package:mac`
4. Follow Apple's notarization workflow

### Linux (AppImage + deb)
```bash
npm run package:linux
```
Outputs to `dist/`:
- `FetchMeThis-1.0.0.AppImage` — Portable AppImage
- `fetchmethis_1.0.0_amd64.deb` — Debian package

## Publishing Releases

### Manual Release
1. Build all platforms:
   ```bash
   npm run package:all
   ```
2. Create GitHub release with:
   - Version tag: `v1.0.0`
   - Release notes from [CHANGELOG.md](CHANGELOG.md)
   - Attach built artifacts from `dist/`
   - SHA256 checksums

### Automated via GitHub Actions
FetchMeThis includes CI/CD workflow (`.github/workflows/build.yml`):
1. Push tag: `git tag v1.0.0 && git push --tags`
2. GitHub Actions automatically:
   - Builds for all platforms
   - Uploads artifacts as release assets
3. Manually publish release in GitHub UI

## Distribution Channels

### GitHub Releases
Primary distribution method. Users download directly from [Releases](https://github.com/neetfrog/FetchMeThis/releases).

### Package Managers (Optional)
Consider adding FetchMeThis to:
- **Windows**: WinGet, Chocolatey
- **macOS**: Homebrew
- **Linux**: Snap Store, Flathub, distro repositories

### Website
Host `dist/` artifacts on your website if desired.

## Post-Release

1. **Announce** release on social media, forums, etc.
2. **Monitor** issue tracker for bugs in new release
3. **Create** a new dev branch for next iteration
4. **Plan** next feature cycle based on feedback

## Update Delivery

### Manual Updates
Users download latest release manually. Document in README that they should check Releases periodically.

### Auto-Updates (Future)
To add automatic updates:

1. Add `electron-updater` dependency:
   ```bash
   npm install electron-updater
   ```

2. Configure update server (GitHub Releases or custom):
   ```ts
   // src/main/index.ts
   import { autoUpdater } from 'electron-updater'
   
   autoUpdater.checkForUpdatesAndNotify()
   ```

3. Publish updates following electron-updater specs

See [electron-updater docs](https://www.electron.build/auto-update) for full integration.

## Troubleshooting

### Build fails on specific platform
- Windows: Ensure NSIS is installed (or run on Windows)
- macOS: Update Xcode Command Line Tools
- Linux: Install required build tools

### Code signing fails
- Verify certificate is valid and accessible
- Check certificate path and password are correct
- Ensure certificate matches build target OS

### File size too large
- Check `dist/` size; if >500MB, verify Electron binary is included
- Remove unnecessary dependencies
- Use source maps only in dev builds

## Security Notes

- Sign all releases with your GPG key
- Verify checksums of downloaded files
- Enable 2FA on GitHub account
- Store signing certificates securely
- Rotate certificates regularly

## Version Strategy

Use [Semantic Versioning](https://semver.org/):
- **MAJOR** — Breaking changes
- **MINOR** — New features (backward compatible)
- **PATCH** — Bug fixes

Example: `1.2.3` = major.minor.patch

## Legal Requirements

- Include LICENSE file in distribution
- Include PRIVACY.md in installer/documentation
- Include attribution to yt-dlp, ffmpeg, gallery-dl
- Ensure compliance with GPL requirements (ffmpeg)

---

For more info, see [SECURITY.md](SECURITY.md) and [CONTRIBUTING.md](CONTRIBUTING.md).
