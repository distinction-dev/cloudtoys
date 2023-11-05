import { ipcMain } from 'electron';
import type { NotificationMessage } from '../../../../types';
import { IpcEventTypes } from '../../../../types';
import { notify } from './notifier';
import services from '../services';
import ProfileService from '../services/ProfileService';

export const initEventSubscriptions = () => {
  ipcMain.on(
    IpcEventTypes.ShowNotification,
    (_e, message: NotificationMessage) => {
      notify(message);
    }
  );

  // TODO: refactor services
  // register cloudwatch service handlers
  Object.keys(services).forEach((service) => {
    ipcMain.handle(service, (_e, params) => services[service](params));
  });

  // register profile service handlers
  Object.keys(ProfileService).forEach((service) => {
    ipcMain.handle(service, (_e, params) => ProfileService[service](params));
  });
};
