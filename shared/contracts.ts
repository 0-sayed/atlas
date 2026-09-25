import { z } from 'zod'
export const idSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/)
export const projectListQuerySchema = z.strictObject({
  after: idSchema.optional(),
})
const text = z.string().trim().min(1).max(4000)
const short = z.string().trim().min(1).max(160)
const revision = z
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
export const caseSchema = z.strictObject({
  id: idSchema,
  label: short,
  hours: z.number().min(0).max(876000),
  owner: z.enum(['you', 'other']),
  confirmed: z.boolean(),
  slot: z.enum(['free', 'occupied', 'unknown']),
})
export const featureSchema = z.strictObject({
  id: idSchema,
  title: short,
  actor: short,
  purpose: text,
  scene: z.strictObject({ kind: z.literal('booking'), version: z.literal(1) }),
  noticeHours: z.number().min(0).max(876000),
  revisionLabel: short,
  evidence: evidenceSchema,
  assetIds: z.array(idSchema).max(20),
  cases: z.array(caseSchema).max(100),
  comparison: z.strictObject({
    title: short,
    hours: z.number().min(0).max(876000),
    beforeNoticeHours: z.number().min(0).max(876000),
    beforeRevision: short,
  }),
})
export const relationSchema = z.strictObject({
  id: idSchema,
  from: idSchema,
  to: idSchema,
  kind: z.enum(['requires', 'related']),
})
export const assetSchema = z.strictObject({
  id: idSchema,
  mediaType: z.enum(['image/png', 'image/jpeg', 'image/webp']),
  provenance: text,
})
export const createSchema = z.strictObject({
  contractVersion: z.literal(1),
  id: idSchema,
  title: short,
  features: z.array(featureSchema).max(100),
  relations: z.array(relationSchema).max(200),
})
export const updateSchema = z.strictObject({
  contractVersion: z.literal(1),
  expectedRevision: revision,
  title: short.optional(),
  upsertFeatures: z.array(featureSchema).max(100).optional(),
  removeFeatureIds: z.array(idSchema).max(100).optional(),
  upsertRelations: z.array(relationSchema).max(200).optional(),
  removeRelationIds: z.array(idSchema).max(200).optional(),
})
export const uploadSchema = z.strictObject({
  contractVersion: z.literal(1),
  expectedRevision: revision,
  ...assetSchema.shape,
  base64: z
    .string()
    .min(4)
    .max(1400000)
    .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/),
})
export const documentSchema = createSchema.extend({
  revision,
  assets: z.array(assetSchema).max(200),
})
export type Feature = z.infer<typeof featureSchema>
export type SavedCase = z.infer<typeof caseSchema>
export type CreateRequest = z.infer<typeof createSchema>
export type UpdateRequest = z.infer<typeof updateSchema>
export type ProjectDocument = z.infer<typeof documentSchema>
export type Asset = z.infer<typeof assetSchema>
export function uniqueIds(items: { id: string }[]) {
  if (new Set(items.map((i) => i.id)).size !== items.length)
    throw new Error('Duplicate IDs')
}
export function validateDocument(input: unknown): ProjectDocument {
  const doc = documentSchema.parse(input)
  uniqueIds(doc.features)
  uniqueIds(doc.relations)
  uniqueIds(doc.assets)
  const features = new Set(doc.features.map((f) => f.id))
  const assets = new Set(doc.assets.map((a) => a.id))
  for (const f of doc.features) {
    uniqueIds(f.cases)
    if (f.cases.some((c) => c.id === 'change-now'))
      throw new Error('Reserved case ID')
    if (
      new Set(f.assetIds).size !== f.assetIds.length ||
      f.assetIds.some((id) => !assets.has(id))
    )
      throw new Error('Invalid scoped asset reference')
  }
  if (doc.relations.some((r) => !features.has(r.from) || !features.has(r.to)))
    throw new Error('Invalid scoped feature reference')
  return doc
}
