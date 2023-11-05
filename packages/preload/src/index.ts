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
