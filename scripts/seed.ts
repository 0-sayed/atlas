import { seed } from '../fixtures/booking.js'
import { config } from '../server/config.js'
import { basename } from 'node:path'
export async function seedApi(port: number, token: string) {
  const response = await fetch(`http://127.0.0.1:${port}/api/v1/projects`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(seed),
  })
  if (!response.ok)
    throw new Error(
      `Seed rejected (${response.status}); existing projects are never overwritten`,
    )
}
if (['seed.js', 'seed.ts'].includes(basename(process.argv[1] ?? ''))) {
  const c = config()
  await seedApi(c.port, c.token)
  console.log('Illustrative booking fixture saved through API')
}
