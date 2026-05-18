import { useState } from 'react'
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface SetupScreenProps {
  onComplete: () => void
}

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  const [state, setState] = useState<'idle' | 'installing' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')

  const handleInstall = async () => {
    setState('installing')
    setProgress('Connecting to GitHub...')

    const offProgress = window.api.onYtDlpInstallProgress((msg: string) => {
      setProgress(msg)
    })

    const res = await window.api.installYtDlp()
    offProgress()

    if (res.success) {
      setState('done')
      setTimeout(onComplete, 1200)
    } else {
      setState('error')
      setError(res.error || 'Unknown error')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <div className="w-20 h-20 bg-app-accent/10 border border-app-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {state === 'done' ? (
            <CheckCircle2 size={36} className="text-app-success" />
          ) : state === 'error' ? (
            <AlertCircle size={36} className="text-red-400" />
          ) : (
            <Download size={36} className="text-app-accent" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-app-text mb-2">
          {state === 'done' ? 'Ready to go!' : state === 'error' ? 'Setup failed' : 'One-time setup'}
        </h1>

        <p className="text-app-secondary text-sm leading-relaxed">
          {state === 'idle' &&
            'FetchMeThis uses yt-dlp to download from 1000+ websites. We need to download the yt-dlp binary first (~10 MB).'}
          {state === 'installing' && progress}
          {state === 'done' && 'yt-dlp is installed. Launching FetchMeThis...'}
          {state === 'error' && (error || 'Could not download yt-dlp. Check your internet connection.')}
        </p>

        {state === 'installing' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-app-muted text-sm">
            <Loader2 size={16} className="animate-spin" />
            Downloading...
          </div>
        )}

        {(state === 'idle' || state === 'error') && (
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-app-accent hover:bg-app-accent-hover text-white font-semibold rounded-xl transition-all"
            >
              <Download size={18} />
              {state === 'error' ? 'Retry' : 'Download yt-dlp'}
            </button>
            <p className="text-[11px] text-app-muted">
              Downloads to your app data folder. No system-wide install required.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
