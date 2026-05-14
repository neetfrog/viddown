import { useEffect, useState } from 'react'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import DownloadsView from './components/DownloadsView'
import HistoryView from './components/HistoryView'
import SettingsView from './components/SettingsView'
import SetupScreen from './components/SetupScreen'
import { useDownloadStore } from './stores/useDownloadStore'
import { NavView } from './types'

export default function App() {
  const [activeView, setActiveView] = useState<NavView>('downloads')
  const [ytdlpReady, setYtdlpReady] = useState<boolean | null>(null)
  const { addDownload, updateDownload } = useDownloadStore()

  // Check if yt-dlp is installed on startup
  useEffect(() => {
    window.api.checkYtDlp().then((res: any) => {
      setYtdlpReady(res.installed)
    })
  }, [])

  // Wire up download event listeners
  useEffect(() => {
    const offProgress = window.api.onDownloadProgress((data: any) => {
      updateDownload(data.id, {
        progress: data.percent,
        speed: data.speed,
        eta: data.eta,
        size: data.size,
        status: 'downloading'
      })
    })

    const offComplete = window.api.onDownloadComplete((data: any) => {
      updateDownload(data.id, {
        status: 'completed',
        progress: 100,
        completedAt: Date.now(),
        speed: undefined,
        eta: undefined
      })
    })

    const offError = window.api.onDownloadError((data: any) => {
      updateDownload(data.id, {
        status: 'error',
        error: data.error,
        speed: undefined,
        eta: undefined
      })
    })

    const offCancelled = window.api.onDownloadCancelled((data: any) => {
      updateDownload(data.id, {
        status: 'cancelled',
        speed: undefined,
        eta: undefined
      })
    })

    return () => {
      offProgress()
      offComplete()
      offError()
      offCancelled()
    }
  }, [updateDownload])

  if (ytdlpReady === null) {
    return (
      <div className="flex h-screen bg-app-bg items-center justify-center">
        <div className="w-6 h-6 border-2 border-app-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!ytdlpReady) {
    return (
      <div className="flex flex-col h-screen bg-app-bg text-app-text">
        <TitleBar />
        <SetupScreen onComplete={() => setYtdlpReady(true)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-app-bg text-app-text">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {activeView === 'downloads' && <DownloadsView />}
          {activeView === 'history' && <HistoryView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  )
}
