import {
  isAuthoredFeature,
  isBookingFeature,
  isApprovalFeature,
  type Feature,
  type ProjectDocument,
} from './contracts.js'

export function featureGroup(project: ProjectDocument, feature: Feature) {
  return (
    project.areas.find((area) => area.id === feature.areaId)?.title ??
    feature.group ??
    (isBookingFeature(feature)
      ? 'Bookings'
      : isApprovalFeature(feature)
        ? 'Reviews'
        : isAuthoredFeature(feature)
          ? 'Activities'
          : 'Navigation')
  )
}

export function searchFeatures(project: ProjectDocument, query: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/)
  const actors = new Map(project.actors.map((actor) => [actor.id, actor.name]))
  const rules = new Map(
    project.rules.map((rule) => [rule.id, `${rule.title} ${rule.statement}`]),
  )
  return project.features.filter((feature) => {
    const content = [
      feature.title,
      feature.purpose,
      feature.actor,
      featureGroup(project, feature),
      ...feature.cases.map((c) =>
        isAuthoredFeature(feature) ? c.label : Object.values(c).join(' '),
      ),
      ...(feature.actorIds ?? []).map((id) => actors.get(id)),
      ...(feature.ruleIds ?? []).map((id) => rules.get(id)),
      ...(isAuthoredFeature(feature)
        ? [
            ...feature.steps.map((step) => `${step.title} ${step.description}`),
            ...feature.cases.map(
              (c) => `${c.outcome.result} ${c.outcome.reason ?? ''}`,
            ),
          ]
        : []),
    ]
      .join(' ')
      .toLocaleLowerCase()
    return words.every((word) => content.includes(word))
  })
}
