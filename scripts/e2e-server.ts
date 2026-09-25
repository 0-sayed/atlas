import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createApp } from '../server/app.js'
import { seedApi } from './seed.js'
const dir = mkdtempSync(join(tmpdir(), 'atlas-browser-'))
const token = 'e2e-only-token-not-a-production-secret'
const port = Number(process.env.ATLAS_E2E_PORT ?? 4174)
const app = await createApp({
  dir,
  token,
  port,
  frontendPort: port,
  staticDir: resolve('dist'),
})
try {
  await app.listen(port, '127.0.0.1')
  await seedApi(port, token)
} catch (error) {
  await app.close()
  rmSync(dir, { recursive: true, force: true })
  throw error
}
// Test harness owns shutdown and removes its isolated storage.
let stopping = false
async function stop() {
  if (stopping) return
  stopping = true
  await app.close()
  rmSync(dir, { recursive: true, force: true })
}
process.on('SIGTERM', () => {
  void stop()
})
process.on('SIGINT', () => {
  void stop()
})
