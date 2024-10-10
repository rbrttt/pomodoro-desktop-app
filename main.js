const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let settingsWindow;
let userSettings = {}; // Store settings in memory

const settingsFilePath = path.join(app.getPath('userData'), 'settings.json'); // Path to save settings

function loadSettings() {
  try {
    const data = fs.readFileSync(settingsFilePath, 'utf-8');
    userSettings = JSON.parse(data);
  } catch (error) {
    userSettings = { alarmVolume: 0.5, selectedTheme: 'light' }; // Default settings
  }
}

function saveSettings() {
  fs.writeFileSync(settingsFilePath, JSON.stringify(userSettings));
}

function createWindow() {
  loadSettings(); // Load settings at startup
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSettingsWindow() {
    if (settingsWindow) {
        settingsWindow.close();  // Close any previous instance of settingsWindow
    }

    settingsWindow = new BrowserWindow({
        width: 500,
        height: 400,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
        },
    });

    settingsWindow.loadFile('settings.html');

    // Send the current settings to the settings window when it's ready
    settingsWindow.webContents.on('did-finish-load', () => {
        settingsWindow.webContents.send('load-settings', userSettings);  // Send saved settings
    });

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}
  


app.whenReady().then(createWindow);

// Listen for the "open-settings" event from the renderer process
ipcMain.on('open-settings', () => {
  createSettingsWindow();  // Ensure settings window is created every time
});

// Listen for "save-settings" event and update settings
ipcMain.on('save-settings', (event, settings) => {
  userSettings = settings;  // Update settings in memory
  saveSettings();           // Save settings to disk
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
