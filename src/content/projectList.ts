import { z } from 'zod'
import { idSchema } from '../../shared/contracts'

const listSchema = z
  .array(
    z.strictObject({
      id: idSchema,
      title: z.string().min(1).max(160),
      revision: z.number().int().positive(),
    }),
  )
  .max(100)

export type SavedProject = z.infer<typeof listSchema>[number]

export async function loadProjectPage(after: string, signal: AbortSignal) {
  const response = await fetch(
    `/api/v1/projects${after ? `?after=${encodeURIComponent(after)}` : ''}`,
    { signal },
  )
  if (!response.ok) throw new Error('Project list unavailable.')
  const result = listSchema.parse(await response.json())
  if (result.some((p, index) => p.id <= (index ? result[index - 1].id : after)))
    throw new Error('Project list incompatible.')
  return result
}
