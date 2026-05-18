# Security Policy

## Supported Versions

| Version | Status | Supported Until |
|---------|--------|-----------------|
| 1.0.x   | Current| May 2027        |

## Reporting a Vulnerability

**Please do not create GitHub issues for security vulnerabilities.**

If you discover a security vulnerability in FetchMeThis, please email `security@fetchmethis.dev` with:

1. **Description**: What is the vulnerability?
2. **Impact**: How could this be exploited?
3. **Reproduction**: Steps to reproduce (if applicable)
4. **Suggested Fix**: Any recommendations (optional)

We will:
- Acknowledge receipt within 24 hours
- Begin investigating immediately
- Keep you informed of progress
- Credit you in the security advisory (unless you prefer anonymity)
- Release a patch as soon as possible

## Security Considerations

### For Users

⚠️ **Legal Compliance**: FetchMeThis is a tool. Users are responsible for ensuring downloaded content complies with:
- Local copyright laws
- Terms of service of content platforms
- Digital rights management regulations

### For Developers

- **Context Isolation**: Always enabled in production
- **Sandbox Mode**: Renderer process runs sandboxed
- **Input Validation**: All IPC inputs validated before use
- **No Node Integration**: Disabled to prevent exploitation
- **CSP Headers**: Configured to prevent XSS
- **Dependencies**: Keep packages updated regularly

## Security Best Practices

1. **Keep FetchMeThis Updated**: Security patches are released as updates
2. **System Security**: Keep your OS and antivirus up to date
3. **Network**: Use VPN/HTTPS only on untrusted networks
4. **Code Review**: If building from source, review code before compilation
5. **Report Issues**: Use the private disclosure process above

## Third-Party Security

FetchMeThis depends on external tools. Review their security practices:

- [yt-dlp Security](https://github.com/yt-dlp/yt-dlp#security)
- [ffmpeg Security](https://ffmpeg.org/security.html)
- [gallery-dl Security](https://github.com/mikf/gallery-dl#security)

## Code Signing & Verification

### Windows
- Installers are built with electron-builder
- Support for code signing via certificate (see CONTRIBUTING.md)

### macOS
- Built with code signing ready
- Notarization support for Apple Gatekeeper (see CONTRIBUTING.md)

### Linux
- AppImage is a single executable
- Verify SHA256 checksums from releases

## Audit & Compliance

- Regular dependency audits via `npm audit`
- GitHub Actions runs `npm audit --audit-level=moderate` on PRs
- Manual security review of sensitive code paths
- Community security feedback welcome

## Changelog

Security patches are documented in [CHANGELOG.md](CHANGELOG.md) with [SECURITY] prefix.

---

Questions? Check [PRIVACY.md](PRIVACY.md) for data handling and [LICENSE](LICENSE) for terms.
