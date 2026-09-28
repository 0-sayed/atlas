import { basename } from 'node:path'
import { seed } from '../fixtures/booking.js'
import {
  publishingStudioReviewUpdate,
  publishingStudioSeed,
} from '../fixtures/publishing-studio.js'
import {
  documentSchema,
  type CreateRequest,
  type ProjectDocument,
} from '../shared/contracts.js'
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
  const created = await seedApi(port, token, publishingStudioSeed)
  if (created.id !== publishingStudioSeed.id || created.revision !== 1)
    throw new Error(
      `Publishing Studio create returned unexpected project/revision (${created.id}, ${created.revision}); review update was not sent`,
    )

  let response: Response
  try {
    response = await post(
      port,
      token,
      `/projects/${publishingStudioSeed.id}/changes`,
      { ...publishingStudioReviewUpdate, expectedRevision: created.revision },
    )
  } catch (cause) {
    throw new Error(
      `Publishing Studio project was created at revision ${created.revision}, but review update did not complete; inspect the project before retrying`,
      { cause },
    )
  }
  if (!response.ok)
    throw new Error(
      `Publishing Studio project was created at revision ${created.revision}, but review update failed (${response.status}); inspect the project before retrying`,
    )
  let updated: ProjectDocument
  try {
    updated = documentSchema.parse(await response.json())
  } catch (cause) {
    throw new Error(
      'Publishing Studio review update returned an invalid response; inspect the project before retrying',
      { cause },
    )
  }
  if (updated.id !== publishingStudioSeed.id || updated.revision !== 2)
    throw new Error(
      `Publishing Studio review update returned unexpected project/revision (${updated.id}, ${updated.revision}); inspect the project before retrying`,
    )
  return updated
}

if (['seed.js', 'seed.ts'].includes(basename(process.argv[1] ?? ''))) {
  const kind = process.argv[2] ?? 'publishing-studio'
  if (kind !== 'publishing-studio' || process.argv.length > 3)
    throw new Error('Choose publishing-studio (the only supported seed)')
  const c = config()
  await seedPublishingStudioApi(c.port, c.token)
  console.log('Publishing Studio showcase saved through API at revision 2')
}
