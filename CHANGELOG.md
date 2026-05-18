# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-15

### Added
- Initial release of FetchMeThis
- One-click auto-setup for yt-dlp, ffmpeg, gallery-dl
- Modern dark UI with Electron + React
- Real-time download progress tracking
- Concurrent download support (up to 5)
- Download history persistence
- Format and quality selector
- Settings panel with customizable download directory
- Logs view for debugging
- Framer motion animations and Lucide icons
- Context isolation and sandbox security
- Comprehensive CI/CD pipeline with GitHub Actions
- Multi-platform packaging (Windows NSIS, macOS DMG, Linux AppImage/deb)
- ESLint and Prettier for code quality
- Jest testing framework with example tests
- Input validation on all IPC handlers

### Security
- Strict context isolation enabled
- Sandbox mode for renderer process
- All user inputs validated before processing
- No remote code execution vectors
- Content Security Policy headers configured

### Documentation
- Complete README with installation and usage guides
- CONTRIBUTING.md with development workflow
- PRIVACY.md explaining data handling
- LICENSE (MIT)
- Comprehensive inline code comments
- GitHub Actions CI/CD workflow

### Development
- electron-vite build system for fast development
- Hot module reloading for dev mode
- TypeScript strict mode enabled
- Zustand for state management
- Tailwind CSS for styling

---

## Unreleased

### Planned
- Auto-updater integration
- Advanced download filters (date range, size, etc.)
- Playlist batch download improvements
- Multi-profile support
- Integration tests for critical paths
- Crash reporting (Sentry)
- Windows code signing and notarization pipeline
- Dark/light theme toggle

---

For pre-1.0.0 development history, see git log.
