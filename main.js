"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var mainWindow = null;
var isDevelopment = process.env.NODE_ENV === 'development';
var DEV_SERVER_URL = 'http://localhost:3014';
// Get the base directory for static files
var getBaseDir = function () {
    return process.cwd(); // Always use the project root directory
};
// Register protocol before app is ready
electron_1.app.whenReady().then(function () {
    electron_1.protocol.registerSchemesAsPrivileged([
        { scheme: 'file', privileges: { standard: true, secure: true, supportFetchAPI: true } }
    ]);
    electron_1.protocol.registerFileProtocol('file', function (request, callback) {
        var url = request.url.substr(7);
        var normalizedPath = path_1.default.normalize(decodeURIComponent(url));
        var fs = require('fs');
        console.log('File protocol request:', {
            originalUrl: request.url,
            normalizedPath: normalizedPath
        });
        // Always look in the out directory first
        var filePath = path_1.default.join(getBaseDir(), normalizedPath);
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
    mainWindow = new electron_1.BrowserWindow({
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
    var startUrl = isDevelopment
        ? DEV_SERVER_URL
        : "file://".concat(path_1.default.join(getBaseDir(), 'out', 'index.html'));
    console.log('Loading URL:', startUrl);
    mainWindow.loadURL(startUrl).catch(function (err) {
        console.error('Failed to load URL:', err);
    });
    // Open the DevTools in development.
    if (isDevelopment) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (!mainWindow) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map