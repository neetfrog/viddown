import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { downloadManager } from './downloadManager'
import { getSettings, saveSettings, defaultSettings } from './settings'

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1120,
    height: 720,
    minWidth: 860,
    minHeight: 580,
    frame: false,
    backgroundColor: '#0d0d10',
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.viddown')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const win = createWindow()

  // Forward download events to renderer
  downloadManager.on('progress', (data) => win.webContents.send('download-progress', data))
  downloadManager.on('complete', (data) => win.webContents.send('download-complete', data))
  downloadManager.on('error', (data) => win.webContents.send('download-error', data))
  downloadManager.on('cancelled', (data) => win.webContents.send('download-cancelled', data))

  // Window controls
  ipcMain.on('window-minimize', () => win.minimize())
  ipcMain.on('window-maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  ipcMain.on('window-close', () => win.close())
  ipcMain.handle('window-is-maximized', () => win.isMaximized())

  // yt-dlp management
  ipcMain.handle('check-ytdlp', async () => {
    return {
      installed: downloadManager.isYtDlpInstalled(),
      path: downloadManager.getYtDlpPath()
    }
  })

  ipcMain.handle('install-ytdlp', async () => {
    try {
      await downloadManager.installYtDlp((progress) => {
        win.webContents.send('ytdlp-install-progress', progress)
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // Video info
  ipcMain.handle('fetch-video-info', async (_e, url: string) => {
    try {
      const info = await downloadManager.fetchVideoInfo(url)
      return { success: true, data: info }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // Downloads
  ipcMain.handle('start-download', async (_e, request) => {
    const settings = getSettings()
    try {
      await downloadManager.startDownload({
        ...request,
        outputDir: settings.downloadPath,
        ffmpegCustomPath: settings.ffmpegCustomPath,
        galleryDlCustomPath: settings.galleryDlCustomPath
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('cancel-download', (_e, id: string) => {
    downloadManager.cancelDownload(id)
    return { success: true }
  })

  // ffmpeg
  ipcMain.handle('check-ffmpeg', () => {
    const settings = getSettings()
    const path = downloadManager.findFfmpeg(settings.ffmpegCustomPath)
    return { available: !!path, path: path || '' }
  })

  ipcMain.handle('install-ffmpeg', async () => {
    try {
      await downloadManager.installFfmpeg((progress) => {
        win.webContents.send('ffmpeg-install-progress', progress)
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // gallery-dl
  ipcMain.handle('check-gallery-dl', () => {
    const settings = getSettings()
    return {
      installed: downloadManager.isGalleryDlInstalled(settings.galleryDlCustomPath),
      path: downloadManager.getGalleryDlPath(settings.galleryDlCustomPath)
    }
  })

  ipcMain.handle('install-gallery-dl', async () => {
    try {
      await downloadManager.installGalleryDl((progress) => {
        win.webContents.send('gallery-dl-install-progress', progress)
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // File system
  ipcMain.handle('open-file', (_e, filePath: string) => {
    shell.openPath(filePath)
  })

  ipcMain.handle('open-folder', (_e, folderPath: string) => {
    shell.openPath(folderPath)
  })

  ipcMain.handle('choose-directory', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    if (result.canceled) return null
    return result.filePaths[0]
  })

  // Settings
  ipcMain.handle('get-settings', () => getSettings())
  ipcMain.handle('save-settings', (_e, settings) => {
    saveSettings(settings)
    return { success: true }
  })
  ipcMain.handle('get-default-download-path', () => {
    return defaultSettings.downloadPath
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
