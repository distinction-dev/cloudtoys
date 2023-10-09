import { ipcMain } from 'electron'
import services from './index'
import ProfileService from './ProfileService'

export const registerServices = () => {
  // register cloudwatch service handlers
  Object.keys(services).forEach((service) => {
    ipcMain.handle(service, (_e, params) => services[service](params))
  })

  // register profile service handlers
  Object.keys(ProfileService).forEach((service) => {
    ipcMain.handle(service, (_e, params) => ProfileService[service](params))
  })
}
