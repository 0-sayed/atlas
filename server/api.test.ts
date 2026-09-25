import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from './app.js'
import { seed } from '../fixtures/booking.js'
const token = 'test-only-local-token-32-characters'
const png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII='
let dir: string
let app: Awaited<ReturnType<typeof createApp>>
beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'atlas-api-'))
  app = await createApp({ dir, port: 4317, token, frontendPort: 5173 })
})
afterEach(async () => {
  await app?.close()
  rmSync(dir, { recursive: true, force: true })
})
function api() {
  return request(app.getHttpServer())
}
function post(path: string, data: object) {
  return api()
    .post(`/api/v1${path}`)
    .set('Host', '127.0.0.1:4317')
    .set('Authorization', `Bearer ${token}`)
    .send(data)
}
it('serves readiness, create/read/update/history with real persistence', async () => {
  await api().get('/api/v1/ready').set('Host', '127.0.0.1:4317').expect(200)
  await post('/projects', seed).expect(201)
  const saved = await api()
    .get(`/api/v1/projects/${seed.id}`)
    .set('Host', '127.0.0.1:4317')
    .expect(200)
  expect(saved.body.features).toEqual(seed.features)
  await post(`/projects/${seed.id}/changes`, {
    contractVersion: 1,
    expectedRevision: 1,
    title: 'New title',
  }).expect(201)
  await post(`/projects/${seed.id}/changes`, {
    contractVersion: 1,
    expectedRevision: 1,
  }).expect(409)
  const history = await api()
    .get(`/api/v1/projects/${seed.id}/history`)
    .set('Host', '127.0.0.1:4317')
    .expect(200)
  expect(history.body).toHaveLength(2)
})
it('rejects credentials, hostile sites and DNS rebinding before writes', async () => {
  await api()
    .post('/api/v1/projects')
    .set('Host', '127.0.0.1:4317')
    .send(seed)
    .expect(401)
  await post('/projects', seed)
    .set('Origin', 'https://evil.example')
    .expect(403)
  await post('/projects', seed).set('Origin', 'null').expect(403)
  await post('/projects', seed).set('Host', 'evil.example:4317').expect(403)
  await post('/projects', seed)
    .set('Origin', 'http://127.0.0.1:9999')
    .expect(403)
  await post('/projects', seed).set('Sec-Fetch-Site', 'cross-site').expect(403)
  await post('/projects', seed)
    .set('Origin', 'http://127.0.0.1:4317')
    .expect(201)
})
it('rejects invalid bodies/references and oversized requests without state changes', async () => {
  await post('/projects', { ...seed, extra: true }).expect(400)
  await post('/projects', seed).expect(201)
  await post(`/projects/${seed.id}/changes`, {
    contractVersion: 1,
    expectedRevision: 1,
    upsertRelations: [
      { id: 'r', from: 'booking', to: 'foreign', kind: 'requires' },
    ],
  }).expect(400)
  await post('/projects', { data: 'x'.repeat(2100000) }).expect(413)
  const saved = await api()
    .get(`/api/v1/projects/${seed.id}`)
    .set('Host', '127.0.0.1:4317')
  expect(saved.body.revision).toBe(1)
})
it('serves registered scoped images only, rejecting types, paths and symlinks', async () => {
  await post('/projects', seed).expect(201)
  const upload = {
    contractVersion: 1,
    expectedRevision: 1,
    id: 'art',
    mediaType: 'image/png',
    provenance: 'Original test pixel',
    base64: png,
  }
  await post(`/projects/${seed.id}/assets`, {
    ...upload,
    path: '/etc/passwd',
  }).expect(400)
  await post(`/projects/${seed.id}/assets`, {
    ...upload,
    mediaType: 'image/svg+xml',
  }).expect(400)
  await post(`/projects/${seed.id}/assets`, {
    ...upload,
    base64: Buffer.from('<script/>').toString('base64'),
  }).expect(400)
  await post(`/projects/${seed.id}/assets`, upload).expect(201)
  const image = await api()
    .get(`/api/v1/projects/${seed.id}/assets/art`)
    .set('Host', '127.0.0.1:4317')
    .expect(200)
  expect(image.headers['content-type']).toContain('image/png')
  expect(image.body).toEqual(Buffer.from(png, 'base64'))
  await api()
    .get('/api/v1/projects/other/assets/art')
    .set('Host', '127.0.0.1:4317')
    .expect(404)
  await api()
    .get('/.local/atlas.sqlite')
    .set('Host', '127.0.0.1:4317')
    .expect(404)
  await api().get('/server/store.ts').set('Host', '127.0.0.1:4317').expect(404)
  const { readdirSync } = await import('node:fs')
  const file = join(dir, 'assets', readdirSync(join(dir, 'assets'))[0])
  rmSync(file)
  writeFileSync(join(dir, 'secret'), 'private')
  symlinkSync(join(dir, 'secret'), file)
  await api()
    .get(`/api/v1/projects/${seed.id}/assets/art`)
    .set('Host', '127.0.0.1:4317')
    .expect(404)
})
