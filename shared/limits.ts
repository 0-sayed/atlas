import type { ProjectDocument } from './contracts.js'

export const limits = {
  writeFeatures: 100,
  writeRelations: 200,
  writeRecords: 100,
  projectFeatures: 500,
  projectRelations: 2000,
  projectEvidence: 2000,
  projectRecords: 1000,
  projectAssets: 200,
  requestBytes: 2 * 1024 * 1024,
  documentBytes: 8 * 1024 * 1024,
  // Prior APIs allowed 100 whole features, each within a 2 MiB request,
  // plus bounded asset metadata. Keep those legacy-only documents readable.
  legacyDocumentBytes: 256 * 1024 * 1024,
} as const

export function documentByteLimit(doc: ProjectDocument) {
  const legacyOnly =
    !doc.purpose &&
    (
      [
        'evidenceRecords',
        'actors',
        'rules',
        'areas',
        'journeys',
        'glossary',
      ] as const
    ).every((key) => doc[key].length === 0) &&
    doc.features.length <= 100 &&
    doc.relations.length <= 200 &&
    doc.features.every(
      (feature) =>
        feature.scene.kind !== 'authored' &&
        !['actorIds', 'ruleIds', 'areaId', 'evidenceIds'].some(
          (key) => key in feature,
        ) &&
        new TextEncoder().encode(JSON.stringify(feature)).byteLength <=
          limits.requestBytes,
    ) &&
    doc.relations.every(
      (relation) =>
        ['requires', 'related'].includes(relation.kind) &&
        !relation.evidenceIds,
    )
  return legacyOnly ? limits.legacyDocumentBytes : limits.documentBytes
}
