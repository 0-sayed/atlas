import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'node:net'
import { randomBytes } from 'node:crypto'
import { once } from 'node:events'
import assert from 'node:assert/strict'
import { seedApi } from './seed.js'
const dir = mkdtempSync(join(tmpdir(), 'atlas-smoke-'))
const socket = createServer()
socket.listen(0, '127.0.0.1')
await once(socket, 'listening')
const address = socket.address()
assert(address && typeof address === 'object')
const port = address.port
await new Promise<void>((done) => socket.close(() => done()))
const token = randomBytes(32).toString('hex')
let output = ''
function start() {
  const child = spawn(process.execPath, ['dist-server/server/main.js'], {
    env: {
      ...process.env,
      ATLAS_DATA_DIR: dir,
      ATLAS_WRITE_TOKEN: token,
      ATLAS_PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', (chunk) => {
    output += String(chunk)
  })
  child.stderr.on('data', (chunk) => {
    output += String(chunk)
  })
  return child
}
let child = start()
async function ready() {
  for (let n = 0; n < 100; n++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/api/v1/ready`)).ok) return
    } catch {
      /* wait for listener */
    }
    if (child.exitCode !== null)
      throw new Error('Production server exited before readiness')
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error('Production server did not become ready')
}
async function stop() {
  const exited = once(child, 'exit')
  child.kill('SIGTERM')
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      exited,
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          child.kill('SIGKILL')
          reject(new Error('Production shutdown timed out'))
        }, 5000)
      }),
    ])
  } finally {
    clearTimeout(timeout)
  }
}
try {
  await ready()
  await seedApi(port, token)
  assert.match(
    await (await fetch(`http://127.0.0.1:${port}/`)).text(),
    /<div id="root">/,
  )
  for (const path of [
    '/.local/atlas.sqlite',
    '/.env',
    '/server/main.ts',
    '/planning/bootstrap.md',
  ])
    assert.equal((await fetch(`http://127.0.0.1:${port}${path}`)).status, 404)
  await stop()
  child = start()
  await ready()
  const document = await (
    await fetch(`http://127.0.0.1:${port}/api/v1/projects/booking-demo`)
  ).json()
  assert.equal(document.revision, 1)
  assert.equal(document.features[0].noticeHours, 24)
  await stop()
  await assert.rejects(fetch(`http://127.0.0.1:${port}/api/v1/ready`))
  assert(!output.includes(token))
  console.log(
    'Production smoke passed: HTTP seed, private-path rejection, restart persistence, clean shutdown',
  )
} finally {
  if (child.exitCode === null && child.signalCode === null) await stop()
  rmSync(dir, { recursive: true, force: true })
}
