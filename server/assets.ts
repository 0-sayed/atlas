import {
  constants,
  mkdirSync,
  openSync,
  closeSync,
  readFileSync,
  lstatSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { uploadSchema, idSchema } from '../shared/contracts.js'
import { Store, DataError } from './store.js'
export function assetPath(dir: string, key: string) {
  if (!/^[a-zA-Z0-9-]+\.(png|jpeg|webp)$/.test(key))
    throw new DataError(404, 'not_found', 'Asset unavailable')
  const root = join(dir, 'assets')
  if (lstatSync(root).isSymbolicLink())
    throw new DataError(404, 'not_found', 'Asset unavailable')
  return join(root, key)
}
export function readAssetFile(dir: string, key: string) {
  try {
    const fd = openSync(
      assetPath(dir, key),
      constants.O_RDONLY | constants.O_NOFOLLOW,
    )
    try {
      return readFileSync(fd)
    } finally {
      closeSync(fd)
    }
  } catch {
    throw new DataError(404, 'not_found', 'Asset unavailable')
  }
}
export function registerAsset(store: Store, project: string, input: unknown) {
  idSchema.parse(project)
  const data = uploadSchema.parse(input)
  const bytes = Buffer.from(data.base64, 'base64')
  const valid =
    data.mediaType === 'image/png'
      ? bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) &&
        bytes.length >= 33
      : data.mediaType === 'image/jpeg'
        ? bytes[0] === 255 &&
          bytes[1] === 216 &&
          bytes.at(-2) === 255 &&
          bytes.at(-1) === 217
        : bytes.toString('ascii', 0, 4) === 'RIFF' &&
          bytes.toString('ascii', 8, 12) === 'WEBP'
  if (!valid || bytes.length > 1024 * 1024)
    throw new DataError(
      400,
      'invalid_asset',
      'Expected a PNG, JPEG or WebP image up to 1 MiB',
    )
  const folder = join(store.dir, 'assets')
  mkdirSync(folder, { recursive: true, mode: 0o700 })
  const key = `${randomUUID()}.${data.mediaType.split('/')[1]}`
  const path = assetPath(store.dir, key)
  writeFileSync(path, bytes, { flag: 'wx', mode: 0o600 })
  try {
    return store.register(
      project,
      data.expectedRevision,
      { id: data.id, mediaType: data.mediaType, provenance: data.provenance },
      key,
    )
  } catch (error) {
    unlinkSync(path)
    throw error
  }
}
