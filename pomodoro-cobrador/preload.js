const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  appendLog: (line) => ipcRenderer.invoke('append-log', line)
});
