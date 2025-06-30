import { app } from 'electron'
import { promises as fs } from 'fs'
import * as path from 'path'

const outputDir = path.join(app.getAppPath(), 'output')
const outputPath = path.join(outputDir, 'clash_config.yaml')

export const saveConfig = async (configContent: string): Promise<void> => {
  try {
    await fs.mkdir(outputDir, { recursive: true })
    await fs.writeFile(outputPath, configContent, 'utf-8')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to save config file: ${message}`)
  }
}
