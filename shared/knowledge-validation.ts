import type { ProjectDocument, AuthoredFeature } from './contracts.js'

export function validateKnowledge(doc: ProjectDocument) {
  const keys = [
    'evidenceRecords',
    'actors',
    'rules',
    'areas',
    'journeys',
    'glossary',
  ] as const
  const sets = Object.fromEntries(
    keys.map((key) => [key, new Set(doc[key].map((r) => r.id))]),
  )
  const check = (ids: string[], available: Set<string>, label: string) => {
    if (
      new Set(ids).size !== ids.length ||
      ids.some((id) => !available.has(id))
    )
      throw new Error(`Invalid scoped ${label} reference`)
  }
  for (const key of keys) {
    if (sets[key].size !== doc[key].length)
      throw new Error(`Duplicate ${key} IDs`)
    if (key !== 'evidenceRecords')
      for (const record of doc[key])
        check(record.evidenceIds, sets.evidenceRecords, 'evidence')
  }
  if (doc.purpose)
    check(doc.purpose.evidenceIds, sets.evidenceRecords, 'purpose evidence')
  const features = new Map(doc.features.map((f) => [f.id, f]))
  const featureIds = new Set(features.keys())
  for (const f of doc.features) {
    check(f.actorIds ?? [], sets.actors, 'actor')
    check(f.ruleIds ?? [], sets.rules, 'rule')
    check(f.evidenceIds ?? [], sets.evidenceRecords, 'evidence')
    if (f.areaId) check([f.areaId], sets.areas, 'area')
    if (f.scene.kind !== 'authored') continue
    const activity = f as AuthoredFeature
    const steps = new Set(activity.steps.map((s) => s.id))
    if (steps.size !== activity.steps.length)
      throw new Error('Duplicate step IDs')
    for (const step of activity.steps) {
      check(step.actorIds, new Set(activity.actorIds), 'step actor')
      check(step.ruleIds, new Set(activity.ruleIds), 'step rule')
      check(step.evidenceIds, sets.evidenceRecords, 'step evidence')
    }
    for (const c of activity.cases) {
      check(c.stepIds, steps, 'case step')
      check(
        c.conditions.map((condition) => condition.ruleId),
        new Set(activity.ruleIds),
        'case condition',
      )
      check(c.evidenceIds, sets.evidenceRecords, 'case evidence')
    }
  }
  for (const journey of doc.journeys)
    for (const step of journey.steps) {
      const f = features.get(step.featureId)
      if (
        !f ||
        (step.stepId &&
          (f.scene.kind !== 'authored' ||
            !(f as AuthoredFeature).steps.some((s) => s.id === step.stepId)))
      )
        throw new Error('Invalid scoped journey reference')
    }
  for (const term of doc.glossary) {
    check(term.featureIds, featureIds, 'glossary feature')
    check(term.ruleIds, sets.rules, 'glossary rule')
  }
  for (const relation of doc.relations) {
    check(
      relation.evidenceIds ?? [],
      sets.evidenceRecords,
      'relationship evidence',
    )
    if (
      ['blocks', 'triggers'].includes(relation.kind) &&
      !relation.evidenceIds?.length
    )
      throw new Error('Invalid typed relationship evidence reference')
  }
}
