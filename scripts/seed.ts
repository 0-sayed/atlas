import { seed } from '../fixtures/booking.js'
import { approvalSeed } from '../fixtures/approval.js'
import type { CreateRequest } from '../shared/contracts.js'
import { config } from '../server/config.js'
import { basename } from 'node:path'
export async function seedApi(
  port: number,
  token: string,
  project: CreateRequest = seed,
) {
  const response = await fetch(`http://127.0.0.1:${port}/api/v1/projects`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  })
  if (!response.ok)
    throw new Error(
      `Seed rejected (${response.status}); existing projects are never overwritten`,
    )
}
if (['seed.js', 'seed.ts'].includes(basename(process.argv[1] ?? ''))) {
  const c = config()
  const kind = process.argv[2] ?? 'booking'
  if (!['booking', 'approval'].includes(kind))
    throw new Error('Choose booking or approval')
  await seedApi(c.port, c.token, kind === 'approval' ? approvalSeed : seed)
  console.log(`Illustrative ${kind} fixture saved through API`)
}
