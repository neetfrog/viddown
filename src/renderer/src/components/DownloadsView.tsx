import { AnimatePresence, motion } from 'framer-motion'
import { useDownloadStore } from '../stores/useDownloadStore'
import AddDownload from './AddDownload'
import DownloadCard from './DownloadCard'
import { Download, Inbox } from 'lucide-react'

export default function DownloadsView() {
  const downloads = useDownloadStore((s) => s.downloads)
  const removeDownload = useDownloadStore((s) => s.removeDownload)

  const activeDownloads = downloads.filter(
    (d) => d.status !== 'completed' && d.status !== 'error' && d.status !== 'cancelled'
  )

  const handleCancel = async (id: string) => {
    await window.api.cancelDownload(id)
  }

  const handleRemove = (id: string) => {
    removeDownload(id)
  }

  const handleOpenFolder = async (id: string) => {
    const item = downloads.find((d) => d.id === id)
    if (item?.filePath) {
      await window.api.openFile(item.filePath)
    } else {
      const settings = await window.api.getSettings()
      await window.api.openFolder(settings.downloadPath)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AddDownload />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {activeDownloads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-app-card border border-app-border flex items-center justify-center">
              <Inbox size={28} className="text-app-muted" />
            </div>
            <div>
              <p className="text-app-secondary font-medium">No active downloads</p>
              <p className="text-app-muted text-sm mt-1">Paste a URL above to get started</p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 mb-1">
              <Download size={14} className="text-app-muted" />
              <span className="text-xs font-medium text-app-muted uppercase tracking-wider">
                Active — {activeDownloads.length}
              </span>
            </div>
            <AnimatePresence mode="popLayout">
              {activeDownloads.map((item) => (
                <DownloadCard
                  key={item.id}
                  item={item}
                  onCancel={handleCancel}
                  onRemove={handleRemove}
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
