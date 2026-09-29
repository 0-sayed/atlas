import { basename } from 'node:path'
import { seed } from '../fixtures/booking.js'
import { publishingStudioSeed } from '../fixtures/publishing-studio.js'
import { documentSchema, type CreateRequest } from '../shared/contracts.js'
import { config } from '../server/config.js'

async function post(port: number, token: string, path: string, body: object) {
  return fetch(`http://127.0.0.1:${port}/api/v1${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

export async function seedApi(
  port: number,
  token: string,
  project: CreateRequest = seed,
) {
  const response = await post(port, token, '/projects', project)
  if (!response.ok)
    throw new Error(
      `Seed create rejected (${response.status}); existing projects are never overwritten`,
    )
  return documentSchema.parse(await response.json())
}

export async function seedPublishingStudioApi(port: number, token: string) {
  return seedApi(port, token, publishingStudioSeed)
}

if (['seed.js', 'seed.ts'].includes(basename(process.argv[1] ?? ''))) {
  const kind = process.argv[2] ?? 'publishing-studio'
  if (kind !== 'publishing-studio' || process.argv.length > 3)
    throw new Error('Choose publishing-studio (the only supported seed)')
  const c = config()
  await seedPublishingStudioApi(c.port, c.token)
  console.log('Publishing Studio showcase saved through API at revision 1')
}
