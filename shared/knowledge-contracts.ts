import { z } from 'zod'
import {
  evidenceSchema,
  featureFields,
  idSchema,
  short,
  text,
} from './contract-fields.js'
import { limits } from './limits.js'

const references = z.array(idSchema).max(100)
export const evidenceIds = z.array(idSchema).min(1).max(20)
export const evidenceRecordSchema = z.strictObject({
  ...evidenceSchema.shape,
  id: idSchema,
  status: z.enum(['demo', 'supported', 'uncertain', 'conflicting']),
})
export const purposeSchema = z.strictObject({ text, evidenceIds })
export const actorSchema = z.strictObject({
  id: idSchema,
  name: short,
  description: text.optional(),
  evidenceIds,
})
export const ruleSchema = z.strictObject({
  id: idSchema,
  title: short,
  statement: text,
  evidenceIds,
})
export const areaSchema = z.strictObject({
  id: idSchema,
  title: short,
  description: text.optional(),
  evidenceIds,
})
export const journeySchema = z.strictObject({
  id: idSchema,
  title: short,
  goal: text,
  evidenceIds,
  steps: z
    .array(z.strictObject({ featureId: idSchema, stepId: idSchema.optional() }))
    .min(1)
    .max(100),
})
export const glossarySchema = z.strictObject({
  id: idSchema,
  term: short,
  definition: text,
  featureIds: references,
  ruleIds: references,
  evidenceIds,
})
export const bindings = {
  actorIds: references.optional(),
  ruleIds: references.optional(),
  areaId: idSchema.optional(),
  evidenceIds: evidenceIds.optional(),
}
export const authoredStepSchema = z.strictObject({
  id: idSchema,
  title: short,
  description: text,
  actorIds: references,
  ruleIds: references,
  evidenceIds,
})
export const authoredCaseSchema = z.strictObject({
  id: idSchema,
  label: short,
  stepIds: z.array(idSchema).max(50),
  evidenceIds,
  conditions: z
    .array(
      z.strictObject({
        ruleId: idSchema,
        state: z.enum(['met', 'not-met', 'unknown', 'conflicting']),
      }),
    )
    .max(100),
  outcome: z.strictObject({
    status: z.enum(['allowed', 'blocked', 'unknown', 'conflicting']),
    result: text,
    reason: text.optional(),
  }),
})
export const authoredFeatureSchema = z.strictObject({
  ...featureFields,
  ...bindings,
  actorIds: references,
  ruleIds: references,
  evidenceIds,
  scene: z.strictObject({ kind: z.literal('authored'), version: z.literal(1) }),
  steps: z.array(authoredStepSchema).max(50),
  cases: z.array(authoredCaseSchema).max(100),
})
export const recordSchemas = {
  evidenceRecords: evidenceRecordSchema,
  actors: actorSchema,
  rules: ruleSchema,
  areas: areaSchema,
  journeys: journeySchema,
  glossary: glossarySchema,
} as const
export const knowledgeFields = {
  purpose: purposeSchema.optional(),
  evidenceRecords: z
    .array(evidenceRecordSchema)
    .max(limits.projectEvidence)
    .default([]),
  actors: z.array(actorSchema).max(limits.projectRecords).default([]),
  rules: z.array(ruleSchema).max(limits.projectRecords).default([]),
  areas: z.array(areaSchema).max(limits.projectRecords).default([]),
  journeys: z.array(journeySchema).max(limits.projectRecords).default([]),
  glossary: z.array(glossarySchema).max(limits.projectRecords).default([]),
}
export const knowledgeCreateFields = {
  purpose: purposeSchema.optional(),
  evidenceRecords: z
    .array(evidenceRecordSchema)
    .max(limits.writeRecords)
    .optional(),
  actors: z.array(actorSchema).max(limits.writeRecords).optional(),
  rules: z.array(ruleSchema).max(limits.writeRecords).optional(),
  areas: z.array(areaSchema).max(limits.writeRecords).optional(),
  journeys: z.array(journeySchema).max(limits.writeRecords).optional(),
  glossary: z.array(glossarySchema).max(limits.writeRecords).optional(),
}
export const knowledgeUpdateFields = {
  purpose: purposeSchema.nullable().optional(),
  upsertEvidenceRecords: z
    .array(evidenceRecordSchema)
    .max(limits.writeRecords)
    .optional(),
  removeEvidenceRecordIds: references.optional(),
  upsertActors: z.array(actorSchema).max(limits.writeRecords).optional(),
  removeActorIds: references.optional(),
  upsertRules: z.array(ruleSchema).max(limits.writeRecords).optional(),
  removeRuleIds: references.optional(),
  upsertAreas: z.array(areaSchema).max(limits.writeRecords).optional(),
  removeAreaIds: references.optional(),
  upsertJourneys: z.array(journeySchema).max(limits.writeRecords).optional(),
  removeJourneyIds: references.optional(),
  upsertGlossary: z.array(glossarySchema).max(limits.writeRecords).optional(),
  removeGlossaryIds: references.optional(),
}
export type AuthoredFeature = z.infer<typeof authoredFeatureSchema>
export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>
