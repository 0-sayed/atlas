import { isAuthoredFeature, type ProjectDocument } from '../../shared/contracts'
import { destinations, type DestinationId } from './project'
import { projectPath } from './knowledge'

export function actorParticipation(project: ProjectDocument, actorId: string) {
  return project.features
    .filter((f) => f.actorIds?.includes(actorId))
    .map((feature) => ({
      feature,
      steps: isAuthoredFeature(feature)
        ? feature.steps.filter((s) => s.actorIds.includes(actorId))
        : [],
    }))
}
export function ruleContext(project: ProjectDocument, ruleId: string) {
  return project.features
    .filter((f) => f.ruleIds?.includes(ruleId))
    .map((feature) => ({
      feature,
      steps: isAuthoredFeature(feature)
        ? feature.steps.filter((s) => s.ruleIds.includes(ruleId))
        : [],
      cases: isAuthoredFeature(feature)
        ? feature.cases.filter((c) =>
            c.conditions.some((x) => x.ruleId === ruleId),
          )
        : [],
    }))
}
export type FeatureOrigin = DestinationId | 'explore'
export function originParams(params: URLSearchParams) {
  const from = params.get('from')
  const origin: FeatureOrigin = destinations.some((d) => d.id === from)
    ? (from as DestinationId)
    : 'explore'
  const result = new URLSearchParams()
  if (origin === 'start') return { origin, params: result }
  for (const key of origin === 'map'
    ? ['q', 'group', 'view', 'selected', 'page']
    : origin === 'explore'
      ? ['q']
      : ['q', 'item']) {
    const value = params.get(key)
    if (value) result.set(key, value)
  }
  return { origin, params: result }
}
export function featureHref(
  projectId: string,
  featureId: string,
  from: FeatureOrigin,
  params = new URLSearchParams(),
  caseId?: string,
) {
  const input = new URLSearchParams(params)
  input.set('from', from)
  const clean = originParams(input).params
  clean.set('from', from)
  if (caseId) clean.set('case', caseId)
  return `${projectPath(projectId)}/explore/${featureId}?${clean}`
}
export function featureReturn(projectId: string, input: URLSearchParams) {
  const { origin, params } = originParams(input)
  const destination = destinations.find((d) => d.id === origin)
  return {
    label: destination?.label ?? 'Explore',
    to: `${projectPath(projectId)}${destination ? (destination.path === '/' ? '' : destination.path) : '/explore'}${params.size ? `?${params}` : ''}`,
  }
}
