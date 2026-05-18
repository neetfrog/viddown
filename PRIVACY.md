# Privacy Policy

## Data Collection

FetchMeThis is a **local-first application** that operates entirely on your machine. The app does **not** collect, store, or transmit any personal data to remote servers.

### What data does FetchMeThis process locally?

- **Download history**: Stored in your browser's `localStorage` (limited to completed/error downloads)
- **Settings**: Stored locally in `~/.fetchmethis/settings.json`
- **Downloaded files**: Saved to your configured download directory
- **Temporary files**: Binary downloads (yt-dlp, ffmpeg, gallery-dl) stored in `~/.fetchmethis/bin`

All data remains on your device and is never sent to any external service.

### Network communication

FetchMeThis connects to:
- **GitHub API**: To check for and download latest releases of yt-dlp, ffmpeg, and gallery-dl
- **External video hosts** (YouTube, Twitter, etc.): When fetching video info or downloading content

These connections are necessary for the app's core functionality and are not used to track you.

## Security

- Context isolation and sandbox mode are enforced
- Remote code execution is prevented
- IPC handlers validate all inputs
- No telemetry or analytics

## Third-Party Tools

FetchMeThis depends on external tools. Please review their privacy/licensing:

- [yt-dlp Privacy](https://github.com/yt-dlp/yt-dlp#legal-concerns)
- [ffmpeg](https://ffmpeg.org)
- [gallery-dl Privacy](https://github.com/mikf/gallery-dl#legal-concerns)

## Your Responsibility

**Important**: Downloading copyrighted content without permission is illegal in most jurisdictions.

FetchMeThis is a tool for downloading content you have the right to download. Users are responsible for ensuring compliance with local laws and the terms of service of content providers.

## Changes to This Policy

This policy may be updated at any time. Please check the repository for the latest version.
