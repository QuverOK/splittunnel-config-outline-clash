import { app } from 'electron'
import { promises as fs } from 'fs'
import * as path from 'path'

const defaultDir = path.join(app.getAppPath(), 'output')

export const saveConfig = async (
  configContent: string,
  customDir?: string | null
): Promise<string> => {
  const outputDir = customDir || defaultDir
  const outputPath = path.join(outputDir, 'clash_config.yaml')

  try {
    await fs.mkdir(outputDir, { recursive: true })
    await fs.writeFile(outputPath, configContent, 'utf-8')
    return outputPath
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to save config file: ${message}`)
  }
}
