import {
  mkdirSync,
  existsSync,
  copyFileSync,
  readdirSync,
  lstatSync,
  rmSync,
  renameSync,
  writeFileSync,
  readFileSync,
} from 'node:fs'
import { join, resolve } from 'node:path'
import { randomUUID, createHash } from 'node:crypto'
import { z } from 'zod'
import { Store } from './store.js'
import { readAssetFile } from './assets.js'
const manifestSchema = z.strictObject({
  version: z.literal(1),
  databaseSha256: z.string().regex(/^[a-f0-9]{64}$/),
})
function databaseHash(dir: string) {
  return createHash('sha256')
    .update(readFileSync(join(dir, 'atlas.sqlite')))
    .digest('hex')
}
function assertNew(path: string) {
  if (existsSync(path))
    throw new Error('Destination already exists; choose a new directory')
}
export async function backup(dir: string, destination: string) {
  assertNew(destination)
  if (!existsSync(join(dir, 'atlas.sqlite')))
    throw new Error('Source database does not exist')
  const store = new Store(dir, false)
  const stage = `${resolve(destination)}.stage-${randomUUID()}`
  try {
    mkdirSync(stage, { recursive: true, mode: 0o700 })
    mkdirSync(join(stage, 'assets'))
    await store.db.backup(join(stage, 'atlas.sqlite'))
    writeFileSync(
      join(stage, 'manifest.json'),
      JSON.stringify({ version: 1, databaseSha256: databaseHash(stage) }),
      { flag: 'wx', mode: 0o600 },
    )
    const rows = store.db
      .prepare('SELECT storage_key AS key FROM assets')
      .all() as { key: string }[]
    for (const row of rows)
      writeFileSync(
        join(stage, 'assets', row.key),
        readAssetFile(dir, row.key),
        { flag: 'wx', mode: 0o600 },
      )
    renameSync(stage, destination)
  } finally {
    store.close()
    rmSync(stage, { recursive: true, force: true })
  }
}
export async function restore(source: string, destination: string) {
  assertNew(destination)
  const stage = `${resolve(destination)}.stage-${randomUUID()}`
  try {
    if (lstatSync(join(source, 'atlas.sqlite')).isSymbolicLink())
      throw new Error('Backup database cannot be a symlink')
    mkdirSync(stage, { recursive: true, mode: 0o700 })
    mkdirSync(join(stage, 'assets'))
    copyFileSync(join(source, 'atlas.sqlite'), join(stage, 'atlas.sqlite'))
    const manifest = manifestSchema.parse(
      JSON.parse(readFileSync(join(source, 'manifest.json'), 'utf8')),
    )
    if (databaseHash(stage) !== manifest.databaseSha256)
      throw new Error('Backup database checksum mismatch')
    for (const key of readdirSync(join(source, 'assets')))
      writeFileSync(join(stage, 'assets', key), readAssetFile(source, key), {
        flag: 'wx',
        mode: 0o600,
      })
    const store = new Store(stage)
    try {
      if (
        store.db.pragma('integrity_check', { simple: true }) !== 'ok' ||
        (store.db.pragma('foreign_key_check') as unknown[]).length
      )
        throw new Error('Invalid backup database')
      for (const id of store.projectIds()) {
        store.read(id)
        store.history(id)
      }
      for (const row of store.db
        .prepare('SELECT storage_key AS key FROM assets')
        .all() as { key: string }[])
        readAssetFile(stage, row.key)
    } finally {
      store.close()
    }
    renameSync(stage, destination)
  } finally {
    rmSync(stage, { recursive: true, force: true })
  }
}
