const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const LOG_FILE = path.join(__dirname, 'pomodoro_log.txt');

ipcMain.handle('append-log', (event, line) => {
  fs.appendFileSync(LOG_FILE, line + '\n');
});

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 480,
    height: 360,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
