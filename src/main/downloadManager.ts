import { spawn, ChildProcess } from 'child_process'
import { join } from 'path'
import { app } from 'electron'
import { existsSync, mkdirSync, createWriteStream, chmodSync } from 'fs'
import { EventEmitter } from 'events'
import https from 'https'

// ─── GitHub release detection ─────────────────────────────────────────────────

const YTDLP_GITHUB_API = 'https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest'

async function getLatestReleaseAssetUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      YTDLP_GITHUB_API,
      { headers: { 'User-Agent': 'VidDown/1.0' } },
      (res) => {
        let body = ''
        res.on('data', (chunk) => (body += chunk))
        res.on('end', () => {
          try {
            const data = JSON.parse(body)
            const assets: any[] = data.assets || []
            let assetName: string
            if (process.platform === 'win32') assetName = 'yt-dlp.exe'
            else if (process.platform === 'darwin') assetName = 'yt-dlp_macos'
            else assetName = 'yt-dlp_linux'
            const asset = assets.find((a) => a.name === assetName)
            if (!asset) reject(new Error(`Asset ${assetName} not found in latest release`))
            else resolve(asset.browser_download_url)
          } catch (e) {
            reject(e)
          }
        })
      }
    )
    req.on('error', reject)
  })
}

function downloadFile(
  url: string,
  dest: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const follow = (redirectUrl: string) => {
      https
        .get(redirectUrl, { headers: { 'User-Agent': 'VidDown/1.0' } }, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
            follow(res.headers.location!)
            return
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`))
            return
          }
          const total = parseInt(res.headers['content-length'] || '0', 10)
          let received = 0
          const file = createWriteStream(dest)
          res.on('data', (chunk: Buffer) => {
            received += chunk.length
            if (total > 0 && onProgress) {
              const pct = Math.round((received / total) * 100)
              onProgress(`Downloading yt-dlp... ${pct}%`)
            }
          })
          res.pipe(file)
          file.on('finish', () => file.close(() => resolve()))
          file.on('error', reject)
        })
        .on('error', reject)
    }
    follow(url)
  })
}

export interface DownloadRequest {
  id: string
  url: string
  format: string
  outputDir: string
  title: string
  thumbnail?: string
}

export interface ProgressData {
  id: string
  percent: number
  speed: string
  eta: string
  size: string
}

interface ActiveDownload {
  process: ChildProcess
  aborted: boolean
}

class DownloadManager extends EventEmitter {
  private activeDownloads = new Map<string, ActiveDownload>()
  private ytDlpPath: string

  constructor() {
    super()
    const binDir = join(app.getPath('userData'), 'bin')
    if (!existsSync(binDir)) mkdirSync(binDir, { recursive: true })
    this.ytDlpPath = join(
      binDir,
      process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
    )
  }

  isYtDlpInstalled(): boolean {
    return existsSync(this.ytDlpPath)
  }

  getYtDlpPath(): string {
    return this.ytDlpPath
  }

  async installYtDlp(onProgress?: (msg: string) => void): Promise<void> {
    onProgress?.('Fetching latest yt-dlp release info...')
    const assetUrl = await getLatestReleaseAssetUrl()
    await downloadFile(assetUrl, this.ytDlpPath, onProgress)
    if (process.platform !== 'win32') {
      chmodSync(this.ytDlpPath, 0o755)
    }
    onProgress?.('yt-dlp installed successfully')
  }

  async fetchVideoInfo(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const proc = spawn(this.ytDlpPath, [
        url,
        '--dump-json',
        '--no-playlist',
        '--no-warnings'
      ])
      let stdout = ''
      let stderr = ''
      proc.stdout.on('data', (d: Buffer) => (stdout += d.toString()))
      proc.stderr.on('data', (d: Buffer) => (stderr += d.toString()))
      proc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(stderr.trim() || `yt-dlp exited with code ${code}`))
          return
        }
        try {
          const firstLine = stdout.trim().split('\n')[0]
          resolve(JSON.parse(firstLine))
        } catch {
          reject(new Error('Failed to parse video info'))
        }
      })
      proc.on('error', reject)
    })
  }

  async startDownload(request: DownloadRequest): Promise<void> {
    const { id, url, format, outputDir } = request

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    const outputTemplate = join(outputDir, '%(title).100s [%(id)s].%(ext)s')

    const args = [
      url,
      '-f', format,
      '-o', outputTemplate,
      '--no-playlist',
      '--newline',
      '--no-part',
      '--merge-output-format', 'mp4',
      '--no-warnings'
    ]

    const proc = spawn(this.ytDlpPath, args)
    const active: ActiveDownload = { process: proc, aborted: false }
    this.activeDownloads.set(id, active)

    proc.stdout.on('data', (chunk: Buffer) => {
      if (active.aborted) return
      const lines = chunk.toString().split('\n')
      for (const line of lines) {
        const progress = this.parseProgress(line)
        if (progress) {
          this.emit('progress', { id, ...progress })
        }
      }
    })

    proc.on('error', (err) => {
      this.activeDownloads.delete(id)
      if (!active.aborted) {
        this.emit('error', { id, error: err.message })
      }
    })

    proc.on('close', (code) => {
      this.activeDownloads.delete(id)
      if (!active.aborted) {
        if (code === 0) {
          this.emit('complete', { id })
        } else {
          this.emit('error', { id, error: `yt-dlp exited with code ${code}` })
        }
      }
    })
  }

  cancelDownload(id: string): void {
    const active = this.activeDownloads.get(id)
    if (active) {
      active.aborted = true
      try {
        active.process.kill('SIGTERM')
      } catch {
        // process may have already exited
      }
      this.activeDownloads.delete(id)
      this.emit('cancelled', { id })
    }
  }

  private parseProgress(line: string): Omit<ProgressData, 'id'> | null {
    // Matches: "[download]   45.6% of   32.65MiB at    2.30MiB/s ETA 00:11"
    const match = line.match(
      /\[download\]\s+(\d+\.?\d*)%\s+of\s+~?\s*(\S+)\s+at\s+(\S+)\s+ETA\s+(\S+)/
    )
    if (!match) return null
    return {
      percent: parseFloat(match[1]),
      size: match[2],
      speed: match[3],
      eta: match[4]
    }
  }
}

export const downloadManager = new DownloadManager()
