import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { parseSsUrl } from './features/parse-ss'
import { generateClashConfig } from './features/generate-clash-config'
import { saveConfig } from './features/save-config'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Clash Split Tunnel',
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    if (result.canceled) {
      return undefined
    }
    return result.filePaths[0]
  })

  ipcMain.handle(
    'generate-config',
    async (_, ssLink: string, exeList: string, outputDir?: string | null) => {
      try {
        const defaultDir = join(app.getAppPath(), 'output')
        const targetDir = outputDir || defaultDir
        const finalPath = join(targetDir, 'clash_config.yaml')

        try {
          await fs.access(finalPath)
          const { response } = await dialog.showMessageBox(mainWindow, {
            type: 'question',
            buttons: ['Перезаписать', 'Отмена'],
            defaultId: 0,
            cancelId: 1,
            title: 'Подтверждение',
            message: `Файл clash_config.yaml уже существует. Перезаписать?`
          })

          if (response === 1) {
            // User cancelled
            return { success: false, message: 'Операция отменена пользователем.' }
          }
        } catch {
          // File doesn't exist, no need to ask for confirmation.g
        }

        const parsedSs = parseSsUrl(ssLink)
        const executables = exeList
          .split(/[\n,]+/)
          .map((exe) => exe.trim())
          .filter(Boolean)

        if (executables.length === 0) {
          throw new Error('Не указаны исполняемые файлы')
        }

        const clashConfig = generateClashConfig(parsedSs, executables)
        const savedPath = await saveConfig(clashConfig, outputDir)

        return { success: true, message: `YAML создан: ${savedPath}` }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
        return { success: false, message: `Ошибка: ${message}` }
      }
    }
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
