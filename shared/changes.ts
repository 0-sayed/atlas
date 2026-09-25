import {
  validateDocument,
  type Feature,
  type ProjectDocument,
} from './contracts.js'

export type FeatureChange = {
  kind: 'added' | 'changed' | 'removed'
  id: string
  before?: Feature
  after?: Feature
}
export type RelationChange = {
  kind: 'added' | 'removed'
  relation: ProjectDocument['relations'][number]
  fromTitle: string
  toTitle: string
}
export function relationChanges(
  before: ProjectDocument,
  after: ProjectDocument,
): RelationChange[] {
  const changes: RelationChange[] = []
  for (const [source, target, kind] of [
    [before, after, 'removed'],
    [after, before, 'added'],
  ] as const) {
    for (const relation of source.relations) {
      if (
        target.relations.some(
          (r) =>
            r.id === relation.id &&
            r.from === relation.from &&
            r.to === relation.to &&
            r.kind === relation.kind,
        )
      )
        continue
      changes.push({
        kind,
        relation,
        fromTitle: source.features.find((f) => f.id === relation.from)!.title,
        toTitle: source.features.find((f) => f.id === relation.to)!.title,
      })
    }
  }
  return changes
}
function canonicalDocument(doc: ProjectDocument) {
  const byId = <T extends { id: string }>(items: T[]) =>
    [...items].sort((a, b) => a.id.localeCompare(b.id))
  return JSON.stringify({
    ...doc,
    features: byId(doc.features),
    relations: byId(doc.relations),
    assets: byId(doc.assets),
  })
}
function behavior(feature: Feature) {
  const { revisionLabel, evidence, assetIds, group, essentialOrder, ...facts } =
    feature
  void revisionLabel
  void evidence
  void assetIds
  void group
  void essentialOrder
  return JSON.stringify(facts)
}
export function featureChanges(
  before: ProjectDocument,
  after: ProjectDocument,
): FeatureChange[] {
  const changes: FeatureChange[] = []
  for (const previous of before.features) {
    const current = after.features.find((f) => f.id === previous.id)
    if (!current)
      changes.push({ kind: 'removed', id: previous.id, before: previous })
    else if (behavior(previous) !== behavior(current))
      changes.push({
        kind: 'changed',
        id: current.id,
        before: previous,
        after: current,
      })
  }
  for (const current of after.features) {
    if (!before.features.some((f) => f.id === current.id))
      changes.push({ kind: 'added', id: current.id, after: current })
  }
  return changes
}
export function historyForRevision(
  input: unknown,
  loaded: ProjectDocument,
): ProjectDocument[] {
  if (!Array.isArray(input)) throw new Error('Invalid history')
  const history = input.map(validateDocument)
  if (
    history.some(
      (doc, index) =>
        doc.id !== loaded.id ||
        (index > 0 && doc.revision <= history[index - 1].revision),
    )
  )
    throw new Error('Invalid history identity or order')
  const snapshot = history.find((doc) => doc.revision === loaded.revision)
  if (!snapshot || canonicalDocument(snapshot) !== canonicalDocument(loaded))
    throw new Error('History does not match loaded revision')
  return history.filter((doc) => doc.revision <= loaded.revision)
}
