import { BrowserWindow, screen, ipcMain } from 'electron';
import { join } from 'path';
import { homePageUrl } from '../utils/common';
import {S3Client, ListBucketsCommand, ListObjectsV2Command} from '@aws-sdk/client-s3'
import Store from 'electron-store';


const store = new Store();
const s3Client = new S3Client({
  region: 'ap-south-1',
});

async function listS3BucketsAndContents() {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    return response.Buckets.map(bucket => bucket.Name); // Return the list of bucket names
  } catch (error) {
    console.error('Error listing S3 buckets:', error);
    return []; // Return an empty array in case of an error
  }
}

let mainWindow: BrowserWindow | null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: Math.round(0.8 * screen.getPrimaryDisplay().workArea.width),
    height: Math.round(0.8 * screen.getPrimaryDisplay().workArea.height),
    minWidth: Math.round(0.72 * screen.getPrimaryDisplay().workArea.width),
    minHeight: Math.round(0.72 * screen.getPrimaryDisplay().workArea.height),
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      sandbox: false,
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (import.meta.env.DEV) {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */

  await mainWindow.loadURL(homePageUrl);

  return mainWindow;
}

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.handle('list-s3-buckets', async (_) => {
  const buckets = await listS3BucketsAndContents();
  mainWindow?.webContents.send('s3-buckets', buckets);
  return buckets;
});



/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateMainWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  if (!window.isVisible()) {
    window.show();
  }

  window.focus();

  return window;
}
