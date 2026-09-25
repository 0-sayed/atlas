import { mkdtempSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createServer } from 'node:net'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { expect, it } from 'vitest'
import { Store } from './store.js'
it('releases storage when startup cannot bind the configured port', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-bind-'))
  const occupied = createServer()
  occupied.listen(0, '127.0.0.1')
  await once(occupied, 'listening')
  const address = occupied.address()
  if (!address || typeof address === 'string')
    throw new Error('Missing address')
  const child = spawn(
    process.execPath,
    [
      'node_modules/tsx/dist/cli.mjs',
      '--tsconfig',
      'tsconfig.server.json',
      'server/main.ts',
    ],
    {
      env: {
        ...process.env,
        ATLAS_DATA_DIR: dir,
        ATLAS_PORT: String(address.port),
        ATLAS_WRITE_TOKEN: 'startup-test-token-at-least-32-characters',
      },
      stdio: 'ignore',
    },
  )
  try {
    const [code] = await once(child, 'exit')
    expect(code).toBe(1)
    expect(existsSync(join(dir, '.lock'))).toBe(false)
    const reopened = new Store(dir)
    expect(reopened.ready()).toBe(true)
    reopened.close()
  } finally {
    child.kill()
    await new Promise<void>((done) => occupied.close(() => done()))
    rmSync(dir, { recursive: true, force: true })
  }
})
