export type ShadowsocksConfig = {
  method: string
  password: string
  hostname: string
  port: number
}

const decodeBase64 = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf8')
}

export const parseSsUrl = (ssUrl: string): ShadowsocksConfig => {
  if (!ssUrl.startsWith('ss://')) {
    throw new Error('Invalid ss:// URL format')
  }

  try {
    const urlContent = ssUrl.substring(5)
    let hostname = ''
    let port = 0
    let password = ''
    let method = ''

    const atIndex = urlContent.lastIndexOf('@')
    if (atIndex === -1) {
      throw new Error('Invalid ss:// URL: missing @ symbol')
    }

    const userInfoAndHost = urlContent.substring(0, atIndex)
    const hostAndPortPart = urlContent.substring(atIndex + 1)

    const hostPortSplit = hostAndPortPart.split(':')
    if (hostPortSplit.length !== 2) {
      throw new Error('Invalid ss:// URL: incorrect host:port format')
    }
    hostname = hostPortSplit[0]
    port = parseInt(hostPortSplit[1], 10)
    if (isNaN(port)) {
      throw new Error('Invalid ss:// URL: Port is not a number')
    }

    // Check for url encoded credentials
    const decodedUserInfo = decodeURIComponent(userInfoAndHost)
    const credentials = decodedUserInfo.split(':')
    if (credentials.length === 2) {
      method = credentials[0]
      password = credentials[1]
    } else {
      // Check for base64 encoded credentials
      const decodedCreds = decodeBase64(userInfoAndHost).split(':')
      if (decodedCreds.length !== 2) {
        throw new Error('Invalid ss:// URL: credentials format is incorrect')
      }
      method = decodedCreds[0]
      password = decodedCreds[1]
    }

    if (!method || !password || !hostname || !port) {
      throw new Error('Failed to parse all required fields from ss:// URL')
    }

    return { method, password, hostname, port }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during parsing'
    throw new Error(`Failed to parse ss:// URL: ${message}`)
  }
}
