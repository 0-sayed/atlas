import { mkdtempSync, rmSync, cpSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, it } from 'vitest'
import { createApp } from './app.js'
import { authoredFeature, authoredSeed } from '../fixtures/authored.js'
import { validateDocument } from '../shared/contracts.js'
import { Store } from './store.js'
import { limits } from '../shared/limits.js'

const exec = promisify(execFile)
it('copied preflight rejects an oversized projected current document before any write', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-portable-bytes-'))
  cpSync(resolve('.agents/skills/update-atlas'), join(dir, 'skill'), {
    recursive: true,
  })
  const app = await createApp({
    dir: join(dir, 'storage'),
    port: 4386,
    frontendPort: 4386,
    token: 'portable-only-test-token-32-characters',
  })
  try {
    const store = app.get(Store)
    const features = Array.from({ length: 330 }, (_, i) => ({
      ...authoredFeature,
      id: `large-${i}`,
      steps: Array.from({ length: 6 }, (_, j) => ({
        ...authoredFeature.steps[0],
        id: j === 0 ? 'prepare' : j === 1 ? 'receive' : `extra-${j}`,
        description: 'x'.repeat(4000),
      })),
    }))
    store.create({
      ...authoredSeed,
      features: features.slice(0, 50),
      journeys: [],
      glossary: [],
    })
    for (let i = 50; i < 280; i += 50)
      store.apply(authoredSeed.id, {
        contractVersion: 2,
        expectedRevision: i / 50,
        upsertFeatures: features.slice(i, Math.min(i + 50, 280)),
      })
    const before = store.read(authoredSeed.id)
    expect(Buffer.byteLength(JSON.stringify(before))).toBeLessThan(
      limits.documentBytes,
    )
    const payload = {
      contractVersion: 2,
      expectedRevision: before.revision,
      upsertFeatures: features.slice(280),
    }
    expect(Buffer.byteLength(JSON.stringify(payload))).toBeLessThan(
      limits.requestBytes,
    )
    expect(() => validateDocument({ ...before, features })).toThrow(/8 MiB/)
    const changes = join(dir, 'changes.json')
    writeFileSync(changes, JSON.stringify(payload))
    await app.listen(4386, '127.0.0.1')
    const script = join(dir, 'skill', 'scripts', 'preflight.mjs')
    await expect(
      exec(
        process.execPath,
        [script, 'http://127.0.0.1:4386', changes, before.id],
        { cwd: dir },
      ),
    ).rejects.toThrow(/document.*bytes/i)
    expect(store.read(before.id)).toEqual(before)
    const removalIds = before.features.slice(0, 50).map((f) => f.id)
    writeFileSync(
      changes,
      JSON.stringify({ ...payload, removeFeatureIds: removalIds }),
    )
    const fit = await exec(
      process.execPath,
      [script, 'http://127.0.0.1:4386', changes, before.id],
      { cwd: dir },
    )
    const expected = validateDocument({
      ...before,
      revision: before.revision + 1,
      features: [
        ...before.features.filter((f) => !removalIds.includes(f.id)),
        ...features.slice(280),
      ],
    })
    expect(JSON.parse(fit.stdout)).toMatchObject({
      fit: 'supported',
      projectedDocumentBytes: Buffer.byteLength(JSON.stringify(expected)),
      documentByteLimit: limits.documentBytes,
    })
    expect(store.read(before.id)).toEqual(before)
  } finally {
    await app.close()
    rmSync(dir, { recursive: true, force: true })
  }
}, 20000)
it('runs the independently copied skill preflight and example against advertised capabilities before writes', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-portable-'))
  cpSync(resolve('.agents/skills/update-atlas'), join(dir, 'skill'), {
    recursive: true,
  })
  const token = 'portable-only-test-token-32-characters'
  const app = await createApp({
    dir: join(dir, 'storage'),
    port: 4385,
    frontendPort: 4385,
    token,
  })
  try {
    await app.listen(4385, '127.0.0.1')
    const script = join(dir, 'skill', 'scripts', 'preflight.mjs')
    const example = join(dir, 'skill', 'references', 'authored-example.json')
    const base = 'http://127.0.0.1:4385'
    const passed = await exec(process.execPath, [script, base, example], {
      cwd: dir,
    })
    expect(JSON.parse(passed.stdout)).toMatchObject({
      fit: 'supported',
      contractVersion: 2,
      target: 'new-project',
    })
    const { readFileSync } = await import('node:fs')
    const payload = JSON.parse(readFileSync(example, 'utf8'))
    const post = await fetch(`${base}/api/v1/projects`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    expect(post.status).toBe(201)
    const initial = validateDocument(await post.json())
    expect(initial.features[0].scene.kind).toBe('authored')
    const changes = join(dir, 'changes.json')
    const feature = initial.features[0]
    for (const patch of [
      { contractVersion: 3 },
      {
        upsertFeatures: [
          { ...feature, scene: { kind: 'authored', version: 99 } },
        ],
      },
      {
        upsertFeatures: [
          { ...feature, scene: { kind: 'unrenderable', version: 1 } },
        ],
      },
      {
        upsertFeatures: [
          {
            ...feature,
            presentation: { illustration: 'custom-html', accent: 'sky' },
          },
        ],
      },
      {
        upsertFeatures: [
          {
            ...feature,
            presentation: { illustration: 'parcel', accent: 'unknown' },
          },
        ],
      },
      {
        upsertRelations: [
          {
            id: 'unsupported',
            from: feature.id,
            to: feature.id,
            kind: 'executes',
          },
        ],
      },
      {
        upsertFeatures: Array.from({ length: 101 }, (_, i) => ({
          ...feature,
          id: `feature-${i}`,
        })),
      },
    ]) {
      writeFileSync(
        changes,
        JSON.stringify({
          contractVersion: 2,
          expectedRevision: initial.revision,
          ...patch,
        }),
      )
      await expect(
        exec(process.execPath, [script, base, changes, initial.id], {
          cwd: dir,
        }),
      ).rejects.toThrow(/Unsupported|exceeds/)
      expect(
        validateDocument(
          await (await fetch(`${base}/api/v1/projects/${initial.id}`)).json(),
        ),
      ).toEqual(initial)
    }
    await expect(
      exec(process.execPath, [script, 'https://example.com', example], {
        cwd: dir,
      }),
    ).rejects.toThrow(/loopback/)
    writeFileSync(
      changes,
      JSON.stringify({
        contractVersion: 2,
        expectedRevision: initial.revision,
        title: 'Reviewed title',
      }),
    )
    const fit = await exec(
      process.execPath,
      [script, base, changes, initial.id],
      { cwd: dir },
    )
    expect(JSON.parse(fit.stdout)).toMatchObject({
      fit: 'supported',
      revision: initial.revision,
    })
    expect(
      validateDocument(
        await (await fetch(`${base}/api/v1/projects/${initial.id}`)).json(),
      ).revision,
    ).toBe(initial.revision)
    // The fixtures used here remain explicitly synthetic; authoring does not establish source truth.
    expect(authoredSeed.features[0].evidence.status).toBe('demo')
  } finally {
    await app.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
