import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

const isDevelopment = process.env.NODE_ENV === 'development';
const DEV_SERVER_URL = 'http://localhost:3014';

// Get the base directory for static files
const getBaseDir = () => {
  return process.cwd(); // Always use the project root directory
};

// Register protocol before app is ready
app.whenReady().then(() => {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'file', privileges: { standard: true, secure: true, supportFetchAPI: true } }
  ]);

  protocol.registerFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7);
    const normalizedPath = path.normalize(decodeURIComponent(url));
    const fs = require('fs');
    
    console.log('File protocol request:', {
      originalUrl: request.url,
      normalizedPath
    });

    // Always look in the out directory first
    const filePath = path.join(getBaseDir(), normalizedPath);
    
    console.log('Resolved file path:', filePath);
    
    callback({ 
      path: filePath,
      headers: { 
        'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        'X-Content-Type-Options': 'nosniff'
      }
    });
  });

  createWindow();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      devTools: true
    }
  });

  // Load either the dev server URL or the built static file
  const startUrl = isDevelopment 
    ? DEV_SERVER_URL
    : `file://${path.join(getBaseDir(), 'out', 'index.html')}`;

  console.log('Loading URL:', startUrl);
  
  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Failed to load URL:', err);
  });

  // Open the DevTools in development.
  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    createWindow();
  }
});
