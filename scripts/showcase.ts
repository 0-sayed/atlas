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
let app: Awaited<ReturnType<typeof createApp>> | undefined
try {
  app = await createApp({
    dir,
    token,
    port,
    frontendPort: port,
    staticDir: resolve('dist'),
  })
  await app.listen(port, '127.0.0.1')
  await seedPublishingStudioApi(port, token)
  console.log(`Publishing Studio showcase: http://127.0.0.1:${port}`)
} catch (error) {
  await cleanup()
  throw error
}

async function cleanup() {
  try {
    await app?.close()
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

let stopping = false
async function stop() {
  if (stopping) return
  stopping = true
  await cleanup()
}
process.on('SIGTERM', () => void stop())
process.on('SIGINT', () => void stop())
