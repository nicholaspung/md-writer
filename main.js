const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './src/preload.js'),
    },
  })

  mainWindow.loadFile('./src/index.html')

  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// IPC Processes
ipcMain.on('open-file-dialog', (event) => {
  const files = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      {
        name: 'Markdown Files',
        extensions: ['md', 'mdown', 'markdown', 'marcdown'],
      },
      { name: 'Text Files', extensions: ['txt', 'text'] },
    ],
  })
  if (files) {
    event.sender.send('selected-file', files[0])
  }
})

ipcMain.on('save-file-dialog', (event) => {
  const file = dialog.showSaveDialogSync({
    filters: [
      {
        name: 'Markdown Files',
        extensions: ['md', 'mdown', 'markdown', 'marcdown'],
      },
      { name: 'Text Files', extensions: ['txt', 'text'] },
    ],
  })
  if (file) {
    event.sender.send('save-new-file', file)
  }
})

// Menu for Electron App
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        role: 'open:',
      },
      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        role: 'new:',
      },
      {
        label: 'Save File',
        accelerator: 'CmdOrCtrl+S',
        role: 'save:',
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo:' },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo:',
      },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste:' },
      { type: 'separator' },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll:',
      },
    ],
  },
]

Menu.setApplicationMenu(Menu.buildFromTemplate(template))
