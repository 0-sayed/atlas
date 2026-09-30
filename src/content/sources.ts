import { isAuthoredFeature, type ProjectDocument } from '../../shared/contracts'

/** Source attribution comes only from saved references, never from matching text. */
export function projectSources(project: ProjectDocument) {
  const sources = new Map(
    project.evidenceRecords.map((evidence) => [
      evidence.id,
      { evidence, claims: [] as string[] },
    ]),
  )
  const add = (ids: string[] | undefined, label: string) => {
    for (const id of ids ?? []) sources.get(id)!.claims.push(label)
  }
  add(project.purpose?.evidenceIds, 'Project purpose')
  for (const area of project.areas) add(area.evidenceIds, 'Area: ' + area.title)
  for (const actor of project.actors)
    add(actor.evidenceIds, 'Actor: ' + actor.name)
  for (const rule of project.rules) add(rule.evidenceIds, 'Rule: ' + rule.title)
  for (const journey of project.journeys)
    add(journey.evidenceIds, 'Journey: ' + journey.title)
  for (const term of project.glossary)
    add(term.evidenceIds, 'Term: ' + term.term)
  for (const feature of project.features) {
    add(feature.evidenceIds, 'Activity: ' + feature.title)
    if (isAuthoredFeature(feature)) {
      for (const step of feature.steps)
        add(step.evidenceIds, 'Step: ' + feature.title + ' — ' + step.title)
      for (const c of feature.cases)
        add(c.evidenceIds, 'Case: ' + feature.title + ' — ' + c.label)
    }
  }
  const titles = new Map(
    project.features.map((feature) => [feature.id, feature.title]),
  )
  for (const relation of project.relations)
    add(
      relation.evidenceIds,
      'Connection: ' +
        titles.get(relation.from)! +
        ' → ' +
        titles.get(relation.to)!,
    )
  return [...sources.values()]
}
