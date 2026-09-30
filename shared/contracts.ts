import { z } from 'zod'
import {
  idSchema,
  text,
  short,
  revision,
  evidenceSchema,
  presentationSchema,
  featureFields,
} from './contract-fields.js'
import {
  authoredFeatureSchema,
  bindings,
  evidenceIds,
  knowledgeFields,
  knowledgeCreateFields,
  knowledgeUpdateFields,
} from './knowledge-contracts.js'
import { documentByteLimit, limits } from './limits.js'
import { validateKnowledge } from './knowledge-validation.js'
export { idSchema, evidenceSchema, presentationSchema }
export type { AuthoredFeature, EvidenceRecord } from './knowledge-contracts.js'
export type Presentation = z.infer<typeof presentationSchema>
export const projectListQuerySchema = z.strictObject({
  after: idSchema.optional(),
})
export const caseSchema = z.strictObject({
  id: idSchema,
  label: short,
  hours: z.number().min(0).max(876000),
  owner: z.enum(['you', 'other']),
  confirmed: z.boolean(),
  slot: z.enum(['free', 'occupied', 'unknown']),
})
export const bookingFeatureSchema = z.strictObject({
  ...featureFields,
  scene: z.strictObject({ kind: z.literal('booking'), version: z.literal(1) }),
  noticeHours: z.number().min(0).max(876000),
  cases: z.array(caseSchema).max(100),
})
export const approvalCaseSchema = z.strictObject({
  id: idSchema,
  label: short,
  role: z.enum(['reviewer', 'requester']),
  state: z.enum(['pending', 'closed']),
  approvals: z.number().int().min(0).max(10).nullable(),
})
export const approvalFeatureSchema = z.strictObject({
  ...featureFields,
  scene: z.strictObject({ kind: z.literal('approval'), version: z.literal(1) }),
  requiredApprovals: z.number().int().min(1).max(10),
  cases: z.array(approvalCaseSchema).max(100),
})
export const navigationCaseSchema = z.strictObject({
  id: idSchema,
  label: short,
  start: text,
  action: short,
  result: short,
  reason: text,
  outcome: z.enum(['available', 'unavailable', 'unknown']),
})
export const navigationFeatureSchema = z.strictObject({
  ...featureFields,
  scene: z.strictObject({
    kind: z.literal('navigation'),
    version: z.literal(1),
  }),
  rules: z.array(text).max(20),
  cases: z.array(navigationCaseSchema).max(100),
})
const legacyFeatureSchema = z.union([
  bookingFeatureSchema,
  approvalFeatureSchema,
  navigationFeatureSchema,
])
export const featureSchema = z.union([
  bookingFeatureSchema.extend(bindings),
  approvalFeatureSchema.extend(bindings),
  navigationFeatureSchema.extend(bindings),
  authoredFeatureSchema,
])
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
const legacyCreateSchema = z.strictObject({
  contractVersion: z.literal(1),
  id: idSchema,
  title: short,
  features: z.array(legacyFeatureSchema).max(limits.writeFeatures),
  relations: z.array(relationSchema).max(200),
})
const legacyUpdateSchema = z.strictObject({
  contractVersion: z.literal(1),
  expectedRevision: revision,
  title: short.optional(),
  upsertFeatures: z
    .array(legacyFeatureSchema)
    .max(limits.writeFeatures)
    .optional(),
  removeFeatureIds: z.array(idSchema).max(100).optional(),
  upsertRelations: z.array(relationSchema).max(200).optional(),
  removeRelationIds: z.array(idSchema).max(200).optional(),
})
export const currentRelationSchema = relationSchema.extend({
  kind: z.enum(['requires', 'related', 'blocks', 'triggers']),
  evidenceIds: evidenceIds.optional(),
})
const currentCreateSchema = legacyCreateSchema.extend({
  contractVersion: z.literal(2),
  features: z.array(featureSchema).max(limits.writeFeatures),
  relations: z.array(currentRelationSchema).max(limits.writeRelations),
  ...knowledgeCreateFields,
})
const currentUpdateSchema = legacyUpdateSchema.extend({
  contractVersion: z.literal(2),
  upsertFeatures: z.array(featureSchema).max(limits.writeFeatures).optional(),
  upsertRelations: z
    .array(currentRelationSchema)
    .max(limits.writeRelations)
    .optional(),
  ...knowledgeUpdateFields,
})
export const createSchema = z.discriminatedUnion('contractVersion', [
  legacyCreateSchema,
  currentCreateSchema,
])
export const updateSchema = z.discriminatedUnion('contractVersion', [
  legacyUpdateSchema,
  currentUpdateSchema,
])
export const uploadSchema = z.strictObject({
  contractVersion: z.union([z.literal(1), z.literal(2)]),
  expectedRevision: revision,
  ...assetSchema.shape,
  base64: z
    .string()
    .min(4)
    .max(1400000)
    .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/),
})
const currentDocumentSchema = currentCreateSchema.extend({
  ...knowledgeFields,
  features: z.array(featureSchema).max(limits.projectFeatures),
  relations: z.array(currentRelationSchema).max(limits.projectRelations),
  revision,
  assets: z.array(assetSchema).max(limits.projectAssets),
})
export const documentSchema = z.union([
  legacyCreateSchema
    .extend({
      revision,
      assets: z.array(assetSchema).max(limits.projectAssets),
    })
    .transform((d) =>
      currentDocumentSchema.parse({ ...d, contractVersion: 2 }),
    ),
  currentDocumentSchema,
])
export type Feature = z.infer<typeof featureSchema>
export type BookingFeature = z.infer<typeof bookingFeatureSchema>
export type ApprovalFeature = z.infer<typeof approvalFeatureSchema>
export type ApprovalCase = z.infer<typeof approvalCaseSchema>
export function isBookingFeature(feature: Feature): feature is BookingFeature {
  return feature.scene.kind === 'booking'
}
export type NavigationFeature = z.infer<typeof navigationFeatureSchema>
export type NavigationCase = z.infer<typeof navigationCaseSchema>
export function isNavigationFeature(
  feature: Feature,
): feature is NavigationFeature {
  return feature.scene.kind === 'navigation'
}
export function isApprovalFeature(
  feature: Feature,
): feature is ApprovalFeature {
  return feature.scene.kind === 'approval'
}
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
    if (
      new Set(f.assetIds).size !== f.assetIds.length ||
      f.assetIds.some((id) => !assets.has(id))
    )
      throw new Error('Invalid scoped asset reference')
  }
  if (doc.relations.some((r) => !features.has(r.from) || !features.has(r.to)))
    throw new Error('Invalid scoped feature reference')
  validateKnowledge(doc)
  const byteLimit = documentByteLimit(doc)
  if (new TextEncoder().encode(JSON.stringify(doc)).byteLength > byteLimit)
    throw new Error(
      `Invalid project capacity: current document exceeds ${byteLimit / 1024 / 1024} MiB`,
    )
  return doc
}

export function isAuthoredFeature(
  feature: Feature,
): feature is import('./knowledge-contracts.js').AuthoredFeature {
  return feature.scene.kind === 'authored'
}
