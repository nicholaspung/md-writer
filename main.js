// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("open-file-dialog", (event) => {
  const files = dialog.showOpenDialogSync({
    properties: ["openFile"],
    filters: [
      {
        name: "Markdown Files",
        extensions: ["md", "mdown", "markdown", "marcdown"],
      },
      { name: "Text Files", extensions: ["txt", "text"] },
    ],
  });
  if (files) {
    let content = openFile(files[0]);
    event.sender.send("selected-file", files, content);
  }
});

ipcMain.on("save-file-dialog", (event) => {
  const file = dialog.showSaveDialogSync({
    filters: [
      {
        name: "Markdown Files",
        extensions: ["md", "mdown", "markdown", "marcdown"],
      },
      { name: "Text Files", extensions: ["txt", "text"] },
    ],
    // buttonLabel: "Save",
    // title: "Save File",
  });
  if (file) {
    event.sender.send("new-file", file);
  }
});

// helpers
function openFile(file) {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  return content;
}
