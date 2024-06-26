export { info } from './info';
export { notification } from './notification';
export { manageWindow } from './manageWindow';

import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    electronApi: unknown;
  }
}
contextBridge.exposeInMainWorld('electronApi', {
  invoke: (method: string, params: object) => {
    return ipcRenderer.invoke(method, params);
  },

  // DescribeLogGroupsCommand(params: any) {
  //   return ipcRenderer.invoke('DescribeLogGroupsCommand', params)
  // },
});

contextBridge.exposeInMainWorld('electron', {
  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property: string, val: number) {
      ipcRenderer.send('electron-store-set', property, val);
    },

    // Other method you want to add like has(), reset(), etc.
  },
  // Any other methods you want to expose in the window object.
  // ...
});
