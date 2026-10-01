import { execFile } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { once } from 'node:events'
import { mkdtempSync, rmSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { createApp } from '../server/app.js'
import { publishingStudioSeed } from '../fixtures/publishing-studio.js'
import { isApprovalFeature, isAuthoredFeature } from '../shared/contracts.js'
import { seedPublishingStudioApi } from './seed.js'

const run = promisify(execFile)
let dir: string
let port: number
let token: string
let app: Awaited<ReturnType<typeof createApp>>

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'atlas-seed-'))
  token = randomBytes(32).toString('hex')
  const socket = createServer()
  socket.listen(0, '127.0.0.1')
  await once(socket, 'listening')
  const address = socket.address()
  if (!address || typeof address === 'string') throw new Error('No test port')
  port = address.port
  await new Promise<void>((resolve) => socket.close(() => resolve()))
  app = await createApp({ dir, port, token, frontendPort: port })
  await app.listen(port, '127.0.0.1')
})

afterEach(async () => {
  await app?.close()
  rmSync(dir, { recursive: true, force: true })
})

async function get(path: string) {
  const response = await fetch(`http://127.0.0.1:${port}/api/v1${path}`)
  expect(response.ok).toBe(true)
  return response.json()
}

async function cli(...args: string[]) {
  return run(
    process.execPath,
    ['--import', 'tsx', 'scripts/seed.ts', ...args],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ATLAS_DATA_DIR: dir,
        ATLAS_PORT: String(port),
        ATLAS_WRITE_TOKEN: token,
      },
    },
  )
}

it('creates one project with current review rules at revision 1', async () => {
  const saved = await seedPublishingStudioApi(port, token)
  expect(saved.id).toBe(publishingStudioSeed.id)
  expect(saved.revision).toBe(1)
  expect(await get('/projects')).toEqual([
    { id: saved.id, title: saved.title, revision: 1 },
  ])
  expect(saved.features.find(isApprovalFeature)?.requiredApprovals).toBe(2)
  const loaded = await get(`/projects/${saved.id}`)
  expect(loaded.actors).toHaveLength(4)
  expect(loaded.journeys[0].steps).toHaveLength(5)
  expect(loaded.glossary).toHaveLength(3)
  expect(
    saved.features
      .find(isAuthoredFeature)
      ?.cases.map((example) => example.outcome.status),
  ).toEqual(['allowed', 'blocked', 'unknown', 'conflicting'])
  expect(saved.features).toEqual(
    [...publishingStudioSeed.features].sort((a, b) => a.id.localeCompare(b.id)),
  )
})

it('rejects reseeding without changing a later custom edit', async () => {
  await seedPublishingStudioApi(port, token)
  const response = await fetch(
    `http://127.0.0.1:${port}/api/v1/projects/${publishingStudioSeed.id}/changes`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contractVersion: 1,
        expectedRevision: 1,
        title: 'My edited title',
      }),
    },
  )
  expect(response.status).toBe(201)
  const edited = await get(`/projects/${publishingStudioSeed.id}`)
  await expect(seedPublishingStudioApi(port, token)).rejects.toThrow(
    'Seed create rejected (409)',
  )
  expect(await get(`/projects/${publishingStudioSeed.id}`)).toEqual(edited)
})

it('rejects a bad token before writing', async () => {
  await expect(seedPublishingStudioApi(port, 'wrong-token')).rejects.toThrow(
    'Seed create rejected (401)',
  )
  expect(await get('/projects')).toEqual([])
})

it.each([[], ['publishing-studio']])(
  'CLI accepts the default or explicit Publishing Studio seed: %j',
  async (...args) => {
    const result = await cli(...args)
    expect(result.stdout).toContain('revision 1')
    expect(await get('/projects')).toEqual([
      expect.objectContaining({ id: publishingStudioSeed.id, revision: 1 }),
    ])
  },
)

it.each(['booking', 'approval', 'unknown'])(
  'CLI rejects unsupported seed %s before writing',
  async (kind) => {
    await expect(cli(kind)).rejects.toThrow('Choose publishing-studio')
    expect(await get('/projects')).toEqual([])
  },
)
