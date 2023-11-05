import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { app } from 'electron';
import { log } from './logger';

export const getBuildResourceDiractory = () => {
  const dir = path.join(
    import.meta.env.DEV ? app.getAppPath() : process.resourcesPath,
    'buildResources'
  );

  if (!fs.existsSync(dir)) {
    log.error('Cannot find buildResources dir');
    log.error(`Current dir: ${dir}`);
    throw new Error('Cannot find buildResources dir');
  }

  return dir;
};

export const getTrayIcon = () => {
  if (process.platform === 'darwin') {
    return 'macos-16x16Template.png';
  }

  return '16x16.png';
};

export const homePageUrl =
  import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', `file://${__dirname}`).toString();

export const breakPageUrl =
  import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? `${import.meta.env.VITE_DEV_SERVER_URL}#/break`
    : new URL(
        '../renderer/dist/index.html#/break',
        `file://${__dirname}`
      ).toString();

export const settingsPageUrl =
  import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? `${import.meta.env.VITE_DEV_SERVER_URL}#/settings`
    : new URL(
        '../renderer/dist/index.html#/settings',
        `file://${__dirname}`
      ).toString();
