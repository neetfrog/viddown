import { useDownloadStore } from '../useDownloadStore'
import { DownloadItem, DownloadStatus } from '../../types'

describe('useDownloadStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset store state
    useDownloadStore.setState({ downloads: [] })
  })

  describe('addDownload', () => {
    it('should add a download to the store', () => {
      const store = useDownloadStore.getState()
      const download: DownloadItem = {
        id: '1',
        url: 'https://example.com/video',
        title: 'Test Video',
        format: 'best',
        formatLabel: 'Best (1920x1080)',
        status: 'queued' as DownloadStatus,
        progress: 0,
        addedAt: Date.now()
      }

      store.addDownload(download)
      const state = useDownloadStore.getState()
      expect(state.downloads).toHaveLength(1)
      expect(state.downloads[0]).toEqual(download)
    })
  })

  describe('updateDownload', () => {
    it('should update a download', () => {
      const store = useDownloadStore.getState()
      const download: DownloadItem = {
        id: '1',
        url: 'https://example.com/video',
        title: 'Test Video',
        format: 'best',
        formatLabel: 'Best (1920x1080)',
        status: 'queued' as DownloadStatus,
        progress: 0,
        addedAt: Date.now()
      }

      store.addDownload(download)
      store.updateDownload('1', { status: 'downloading' as DownloadStatus, progress: 50 })

      const state = useDownloadStore.getState()
      expect(state.downloads[0].status).toBe('downloading')
      expect(state.downloads[0].progress).toBe(50)
    })
  })

  describe('removeDownload', () => {
    it('should remove a download', () => {
      const store = useDownloadStore.getState()
      const download: DownloadItem = {
        id: '1',
        url: 'https://example.com/video',
        title: 'Test Video',
        format: 'best',
        formatLabel: 'Best (1920x1080)',
        status: 'completed' as DownloadStatus,
        progress: 100,
        addedAt: Date.now(),
        completedAt: Date.now()
      }

      store.addDownload(download)
      let state = useDownloadStore.getState()
      expect(state.downloads).toHaveLength(1)

      store.removeDownload('1')
      state = useDownloadStore.getState()
      expect(state.downloads).toHaveLength(0)
    })
  })

  describe('activeDownloads', () => {
    it('should return only active downloads', () => {
      const store = useDownloadStore.getState()
      const downloads: DownloadItem[] = [
        {
          id: '1',
          url: 'https://example.com/video1',
          title: 'Video 1',
          format: 'best',
          formatLabel: 'Best (1920x1080)',
          status: 'downloading' as DownloadStatus,
          progress: 50,
          addedAt: Date.now()
        },
        {
          id: '2',
          url: 'https://example.com/video2',
          title: 'Video 2',
          format: 'best',
          formatLabel: 'Best (1920x1080)',
          status: 'completed' as DownloadStatus,
          progress: 100,
          addedAt: Date.now(),
          completedAt: Date.now()
        }
      ]

      downloads.forEach(d => store.addDownload(d))

      const active = store.activeDownloads()
      expect(active).toHaveLength(1)
      expect(active[0].id).toBe('1')
    })
  })

  describe('historyDownloads', () => {
    it('should return only completed/error downloads', () => {
      const store = useDownloadStore.getState()
      const downloads: DownloadItem[] = [
        {
          id: '1',
          url: 'https://example.com/video1',
          title: 'Video 1',
          format: 'best',
          formatLabel: 'Best (1920x1080)',
          status: 'downloading' as DownloadStatus,
          progress: 50,
          addedAt: Date.now()
        },
        {
          id: '2',
          url: 'https://example.com/video2',
          title: 'Video 2',
          format: 'best',
          formatLabel: 'Best (1920x1080)',
          status: 'completed' as DownloadStatus,
          progress: 100,
          addedAt: Date.now(),
          completedAt: Date.now()
        }
      ]

      downloads.forEach(d => store.addDownload(d))

      const history = store.historyDownloads()
      expect(history).toHaveLength(1)
      expect(history[0].id).toBe('2')
    })
  })
})
