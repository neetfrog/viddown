import { create } from 'zustand'
import { DownloadItem, DownloadStatus } from '../types'

interface DownloadStore {
  downloads: DownloadItem[]
  addDownload: (item: DownloadItem) => void
  updateDownload: (id: string, updates: Partial<DownloadItem>) => void
  removeDownload: (id: string) => void
  clearHistory: () => void
  activeDownloads: () => DownloadItem[]
  historyDownloads: () => DownloadItem[]
}

const HISTORY_KEY = 'fetchmethis_history'
const LEGACY_HISTORY_KEY = 'viddown_history'

function loadHistory(): DownloadItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY) ?? localStorage.getItem(LEGACY_HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveHistory(items: DownloadItem[]): void {
  const history = items.filter((d) => d.status === 'completed' || d.status === 'error')
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 500)))
}

const TERMINAL_STATUSES: DownloadStatus[] = ['completed', 'error', 'cancelled']

export const useDownloadStore = create<DownloadStore>((set, get) => ({
  downloads: loadHistory(),

  addDownload: (item) => {
    set((state) => ({ downloads: [item, ...state.downloads] }))
  },

  updateDownload: (id, updates) => {
    set((state) => {
      const downloads = state.downloads.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      )
      saveHistory(downloads)
      return { downloads }
    })
  },

  removeDownload: (id) => {
    set((state) => {
      const downloads = state.downloads.filter((d) => d.id !== id)
      saveHistory(downloads)
      return { downloads }
    })
  },

  clearHistory: () => {
    set((state) => {
      const active = state.downloads.filter((d) => !TERMINAL_STATUSES.includes(d.status))
      saveHistory([])
      return { downloads: active }
    })
  },

  activeDownloads: () => {
    return get().downloads.filter((d) => !TERMINAL_STATUSES.includes(d.status))
  },

  historyDownloads: () => {
    return get().downloads.filter((d) => TERMINAL_STATUSES.includes(d.status))
  }
}))
