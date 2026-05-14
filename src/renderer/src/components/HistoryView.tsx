import { AnimatePresence, motion } from 'framer-motion'
import { useDownloadStore } from '../stores/useDownloadStore'
import DownloadCard from './DownloadCard'
import { History, Trash2 } from 'lucide-react'

export default function HistoryView() {
  const downloads = useDownloadStore((s) => s.downloads)
  const removeDownload = useDownloadStore((s) => s.removeDownload)
  const clearHistory = useDownloadStore((s) => s.clearHistory)

  const history = downloads.filter(
    (d) => d.status === 'completed' || d.status === 'error' || d.status === 'cancelled'
  )

  const handleOpenFolder = async (id: string) => {
    const item = history.find((d) => d.id === id)
    if (item?.filePath) {
      await window.api.openFile(item.filePath)
    } else {
      const settings = await window.api.getSettings()
      await window.api.openFolder(settings.downloadPath)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-app-border bg-app-surface/50">
        <div className="flex items-center gap-2">
          <History size={16} className="text-app-muted" />
          <span className="text-sm font-medium text-app-text">Download History</span>
          {history.length > 0 && (
            <span className="text-xs text-app-muted bg-app-card border border-app-border px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          )}
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-xs text-app-muted hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-app-card border border-app-border flex items-center justify-center">
              <History size={28} className="text-app-muted" />
            </div>
            <div>
              <p className="text-app-secondary font-medium">No history yet</p>
              <p className="text-app-muted text-sm mt-1">Completed downloads will appear here</p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <AnimatePresence mode="popLayout">
              {history.map((item) => (
                <DownloadCard
                  key={item.id}
                  item={item}
                  onCancel={() => {}}
                  onRemove={removeDownload}
                  onOpenFolder={handleOpenFolder}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
