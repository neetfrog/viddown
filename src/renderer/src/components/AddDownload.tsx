import { useState, useRef } from 'react'
import { Link, Loader2, Search, Download, ChevronDown, X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { VideoInfo, FORMAT_PRESETS } from '../types'
import { useDownloadStore } from '../stores/useDownloadStore'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function AddDownload() {
  const [url, setUrl] = useState('')
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [selectedFormat, setSelectedFormat] = useState(FORMAT_PRESETS[0])
  const [formatOpen, setFormatOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addDownload } = useDownloadStore()

  const isValidUrl = (u: string) => {
    try {
      new URL(u)
      return true
    } catch {
      return false
    }
  }

  const handleFetch = async () => {
    if (!url.trim() || !isValidUrl(url.trim())) return
    setFetchState('loading')
    setFetchError('')
    setVideoInfo(null)

    const res = await window.api.fetchVideoInfo(url.trim())
    if (res.success) {
      setVideoInfo(res.data)
      setFetchState('ready')
    } else {
      setFetchError(res.error || 'Failed to fetch video info.')
      setFetchState('error')
    }
  }

  const handleDownload = async () => {
    const id = generateId()
    const title = videoInfo?.title || url

    addDownload({
      id,
      url: url.trim(),
      title,
      thumbnail: videoInfo?.thumbnail,
      status: 'downloading',
      progress: 0,
      format: selectedFormat.value,
      formatLabel: selectedFormat.label,
      addedAt: Date.now(),
      extractor: videoInfo?.extractor_key
    })

    await window.api.startDownload({
      id,
      url: url.trim(),
      format: selectedFormat.value,
      title,
      thumbnail: videoInfo?.thumbnail
    })

    // Reset form
    setUrl('')
    setVideoInfo(null)
    setFetchState('idle')
  }

  const handleQuickDownload = async () => {
    if (!url.trim() || !isValidUrl(url.trim())) return
    const id = generateId()

    addDownload({
      id,
      url: url.trim(),
      title: url.trim(),
      status: 'fetching-info',
      progress: 0,
      format: selectedFormat.value,
      formatLabel: selectedFormat.label,
      addedAt: Date.now()
    })

    await window.api.startDownload({
      id,
      url: url.trim(),
      format: selectedFormat.value,
      title: url.trim()
    })

    setUrl('')
  }

  const handleReset = () => {
    setUrl('')
    setVideoInfo(null)
    setFetchState('idle')
    setFetchError('')
    inputRef.current?.focus()
  }

  return (
    <div className="px-6 pt-5 pb-4 border-b border-app-border bg-app-surface/50">
      {/* URL Input row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-app-card border border-app-border rounded-xl px-3 py-2.5 focus-within:border-app-accent/60 focus-within:ring-2 focus-within:ring-app-accent/10 transition-all">
          <Link size={15} className="text-app-muted shrink-0" />
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFetch()
            }}
            placeholder="Paste a video URL from YouTube, Twitter, TikTok, and 1000+ more..."
            className="flex-1 bg-transparent text-sm text-app-text placeholder:text-app-muted outline-none min-w-0"
          />
          {url && (
            <button onClick={handleReset} className="text-app-muted hover:text-app-text shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Format selector */}
        <div className="relative">
          <button
            onClick={() => setFormatOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-app-card border border-app-border rounded-xl text-sm text-app-secondary hover:text-app-text hover:border-app-accent/40 transition-all whitespace-nowrap"
          >
            {selectedFormat.label}
            <ChevronDown size={13} className={`transition-transform ${formatOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {formatOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 w-56 bg-app-card border border-app-border rounded-xl shadow-2xl shadow-black/40 z-50 py-1 overflow-hidden"
              >
                {FORMAT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setSelectedFormat(preset)
                      setFormatOpen(false)
                    }}
                    className={`w-full flex flex-col items-start px-3 py-2 text-left hover:bg-white/5 transition-colors ${
                      selectedFormat.value === preset.value ? 'text-app-accent' : 'text-app-text'
                    }`}
                  >
                    <span className="text-sm font-medium">{preset.label}</span>
                    <span className="text-[11px] text-app-muted">{preset.description}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fetch info button */}
        <button
          onClick={handleFetch}
          disabled={!url.trim() || !isValidUrl(url.trim()) || fetchState === 'loading'}
          className="flex items-center gap-2 px-4 py-2.5 bg-app-accent hover:bg-app-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all"
        >
          {fetchState === 'loading' ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Search size={15} />
          )}
          Fetch Info
        </button>
      </div>

      {/* Video preview card */}
      <AnimatePresence>
        {fetchState === 'ready' && videoInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 bg-app-card border border-app-border rounded-xl p-3">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt=""
                  className="w-24 h-14 object-cover rounded-lg shrink-0 bg-app-border"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-app-text line-clamp-2 leading-snug">
                  {videoInfo.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  {videoInfo.uploader && (
                    <span className="text-[11px] text-app-muted">{videoInfo.uploader}</span>
                  )}
                  {videoInfo.duration && (
                    <span className="text-[11px] text-app-muted">
                      {formatDuration(videoInfo.duration)}
                    </span>
                  )}
                  {videoInfo.extractor_key && (
                    <span className="text-[11px] text-app-accent bg-app-accent/10 px-1.5 py-0.5 rounded-full">
                      {videoInfo.extractor_key}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-app-accent hover:bg-app-accent-hover text-white text-sm font-medium rounded-lg transition-all shrink-0"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </motion.div>
        )}

        {fetchState === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-400 font-medium">Failed to fetch video info</p>
                <p className="text-[11px] text-red-400/70 mt-0.5 break-all">{fetchError}</p>
              </div>
              <button
                onClick={handleQuickDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-app-accent hover:bg-app-accent-hover text-white text-xs font-medium rounded-lg transition-all shrink-0"
              >
                <Download size={12} />
                Try anyway
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
