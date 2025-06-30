import { ElectronAPI } from '@electron-toolkit/preload'

interface IApi {
  selectFolder: () => Promise<string | undefined>
  generateConfig: (
    ssLink: string,
    exeList: string,
    outputDir?: string | null
  ) => Promise<{ success: boolean; message: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}
