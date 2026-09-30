import { z } from 'zod'
export const idSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/)
export const text = z.string().trim().min(1).max(4000)
export const short = z.string().trim().min(1).max(160)
export const revision = z
  .number()
  .int()
  .min(0)
  .max(Number.MAX_SAFE_INTEGER - 1)
export const evidenceSchema = z.strictObject({
  status: z.enum(['demo', 'supported', 'uncertain']),
  source: text,
  sourceRevision: short,
  scope: text,
  description: text,
})
export const presentationSchema = z.strictObject({
  illustration: z.enum(['calendar', 'document', 'compass', 'parcel', 'people']),
  accent: z.enum(['sky', 'sage', 'peach']),
})
export const featureFields = {
  id: idSchema,
  title: short,
  actor: short,
  purpose: text,
  group: short.optional(),
  essentialOrder: z.number().int().min(0).max(100).optional(),
  revisionLabel: short,
  evidence: evidenceSchema,
  assetIds: z.array(idSchema).max(20),
  presentation: presentationSchema.optional(),
}
