import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootEnvPath = join(__dirname, '../../../.env')

config({ path: rootEnvPath })

export const env = process.env
