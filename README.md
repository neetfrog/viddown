# VidDown

A modern, local video downloader powered by **yt-dlp**. Supports 1000+ websites including YouTube, Twitter/X, TikTok, Instagram, Twitch, Reddit, and many more.

## Features

- **One-time auto-setup** — downloads yt-dlp automatically on first run, no manual install needed
- **Smart info fetching** — shows thumbnail, title, uploader, and duration before downloading
- **Format & quality selector** — Best quality, 4K, 1080p, 720p, 480p, 360p, Audio-only (MP3)
- **Real-time progress** — live progress bar, speed, and ETA per download
- **Concurrent downloads** — configurable, up to 5 simultaneous downloads
- **Download history** — persists between sessions, with quick folder-open action
- **Cancel support** — cancel any active download
- **Modern dark UI** — frameless window with custom titlebar

## Development

```bash
npm install
npm run dev      # launch in dev mode with hot-reload
npm run build    # production build to /out
npm start        # run production build
```

## Tech stack

- [Electron](https://electronjs.org) + [electron-vite](https://electron-vite.org)
- [React 18](https://react.dev) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs) state management
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (auto-downloaded binary)
- [framer-motion](https://www.framer.com/motion) animations
- [Lucide React](https://lucide.dev) icons

## Supported sites

Everything yt-dlp supports — YouTube, Twitter/X, TikTok, Instagram, Twitch, Vimeo, Reddit, Dailymotion, Facebook, SoundCloud, Bandcamp, and [1000+ more](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md).
