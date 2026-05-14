import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // yt-dlp
  checkYtDlp: () => ipcRenderer.invoke('check-ytdlp'),
  installYtDlp: () => ipcRenderer.invoke('install-ytdlp'),

  // Video info
  fetchVideoInfo: (url: string) => ipcRenderer.invoke('fetch-video-info', url),

  // Downloads
  startDownload: (request: any) => ipcRenderer.invoke('start-download', request),
  cancelDownload: (id: string) => ipcRenderer.invoke('cancel-download', id),

  // File system
  openFile: (filePath: string) => ipcRenderer.invoke('open-file', filePath),
  openFolder: (folderPath: string) => ipcRenderer.invoke('open-folder', folderPath),
  chooseDirectory: () => ipcRenderer.invoke('choose-directory'),

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  getDefaultDownloadPath: () => ipcRenderer.invoke('get-default-download-path'),

  // Events
  onDownloadProgress: (cb: (data: any) => void) => {
    ipcRenderer.on('download-progress', (_e, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('download-progress')
  },
  onDownloadComplete: (cb: (data: any) => void) => {
    ipcRenderer.on('download-complete', (_e, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('download-complete')
  },
  onDownloadError: (cb: (data: any) => void) => {
    ipcRenderer.on('download-error', (_e, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('download-error')
  },
  onDownloadCancelled: (cb: (data: any) => void) => {
    ipcRenderer.on('download-cancelled', (_e, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('download-cancelled')
  },
  onYtDlpInstallProgress: (cb: (msg: string) => void) => {
    ipcRenderer.on('ytdlp-install-progress', (_e, msg) => cb(msg))
    return () => ipcRenderer.removeAllListeners('ytdlp-install-progress')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
