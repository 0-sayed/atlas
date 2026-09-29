import { randomUUID } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createApp } from '../server/app.js'
import { seedPublishingStudioApi } from './seed.js'

// A single disposable showcase, separate from normal storage and browser tests.
const dir = mkdtempSync(join(tmpdir(), 'atlas-showcase-'))
const token = randomUUID()
const port = 4176
const app = await createApp({
  dir,
  token,
  port,
  frontendPort: port,
  staticDir: resolve('dist'),
})
try {
  await app.listen(port, '127.0.0.1')
  await seedPublishingStudioApi(port, token)
  console.log(`Publishing Studio showcase: http://127.0.0.1:${port}`)
} catch (error) {
  await app.close()
  rmSync(dir, { recursive: true, force: true })
  throw error
}

let stopping = false
async function stop() {
  if (stopping) return
  stopping = true
  await app.close()
  rmSync(dir, { recursive: true, force: true })
}
process.on('SIGTERM', () => void stop())
process.on('SIGINT', () => void stop())
