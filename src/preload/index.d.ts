import { ElectronAPI } from '@electron-toolkit/preload'

interface IApi {
  generateConfig: (
    ssLink: string,
    exeList: string
  ) => Promise<{ success: boolean; message: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}
