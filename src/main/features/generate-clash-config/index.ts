import * as yaml from 'js-yaml'
import { ShadowsocksConfig } from '../parse-ss'

type ClashConfig = {
  proxies: {
    name: string
    type: 'ss'
    server: string
    port: number
    cipher: string
    password: string
    udp: boolean
  }[]
  'proxy-groups': {
    name: string
    type: 'select'
    proxies: string[]
  }[]
  rules: string[]
}

export const generateClashConfig = (ssConfig: ShadowsocksConfig, exeList: string[]): string => {
  const config: ClashConfig = {
    proxies: [
      {
        name: 'OutlineVPN',
        type: 'ss',
        server: ssConfig.hostname,
        port: ssConfig.port,
        cipher: ssConfig.method,
        password: ssConfig.password,
        udp: true
      }
    ],
    'proxy-groups': [
      {
        name: 'Proxy',
        type: 'select',
        proxies: ['OutlineVPN', 'DIRECT']
      }
    ],
    rules: [...exeList.map((exe) => `PROCESS-NAME,${exe},Proxy`), 'MATCH,DIRECT']
  }

  return yaml.dump(config)
}
