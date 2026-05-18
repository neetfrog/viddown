# Contributing to FetchMeThis

Thank you for your interest in FetchMeThis! This guide outlines the development process and best practices.

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm 9+
- Windows, macOS, or Linux

## Setup

```bash
git clone https://github.com/yourusername/viddown.git
cd viddown
npm install
```

## Development

### Running in development mode
```bash
npm run dev
```

This starts electron-vite with hot module reloading for both main and renderer processes.

### Building for production
```bash
npm run build
```

This creates optimized bundles in the `out/` directory.

### Packaging

#### Windows
```bash
npm run package:win
```
Creates NSIS installer and portable exe in `dist/`.

#### macOS
```bash
npm run package:mac
```
Creates DMG and zip in `dist/`.

#### Linux
```bash
npm run package:linux
```
Creates AppImage and deb in `dist/`.

#### All platforms
```bash
npm run package:all
```

## Code Quality

### Linting
```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Formatting
```bash
npm run format      # Format all code with Prettier
```

### Type checking
```bash
npx tsc --noEmit
```

## Testing

### Run tests
```bash
npm test            # Single run
npm run test:watch  # Watch mode
npm run test:coverage # With coverage report
```

### Writing tests
- Place test files in `__tests__` directories
- Use `.test.ts` or `.spec.ts` suffix
- Follow the patterns in [src/renderer/src/stores/__tests__/](src/renderer/src/stores/__tests__/)

## Git Workflow

1. **Branch naming**: `feature/foo`, `fix/bar`, `docs/baz`
2. **Commits**: Write clear, descriptive commit messages
3. **Pull Requests**: 
   - Link related issues
   - Describe changes and motivation
   - Ensure CI passes before merging

## Code Style

- Follow ESLint and Prettier rules (enforced automatically)
- Use TypeScript strict mode
- Add JSDoc comments for public functions
- Handle errors explicitly (no silent failures)

## Security Guidelines

- Always use `contextIsolation: true` in BrowserWindow
- Validate all IPC inputs (type, range, format)
- Avoid shell operations with user input
- Use `sandbox: true` for renderer process
- Run `npm audit` before releases

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` (if present)
3. Create git tag: `git tag v1.0.0`
4. Push to repository
5. GitHub Actions automatically builds and uploads artifacts
6. Create GitHub release with notes and artifacts

## Project Structure

```
src/
├── main/              # Electron main process
│   ├── index.ts       # App entry, IPC handlers
│   ├── downloadManager.ts
│   └── settings.ts
├── preload/           # Preload script (context bridge)
│   └── index.ts
└── renderer/          # React UI
    └── src/
        ├── App.tsx
        ├── components/
        ├── stores/
        └── types/
```

## Debugging

### Main process
Run with inspector:
```bash
npm run dev -- --inspect
```

### Renderer process
Press `Ctrl+Shift+I` to open DevTools in dev mode.

### Logs
Check `~/.fetchmethis/` for app data and logs.

## Architecture Notes

- **Electron 31+**: Latest stable
- **React 18+**: Client UI framework
- **Zustand**: Lightweight state management
- **electron-vite**: Fast build tool (Vite + Electron)
- **Tailwind CSS**: Utility-first styling

## Common Issues

**"yt-dlp not found"**: Run setup screen to auto-download binaries.

**Build fails on macOS**: Ensure Xcode Command Line Tools are installed:
```bash
xcode-select --install
```

**Windows NSIS error**: Try running as Administrator.

## Questions?

Check [PRIVACY.md](PRIVACY.md) for privacy/legal info and [LICENSE](LICENSE) for licensing terms.

Happy hacking! 🎥📥
