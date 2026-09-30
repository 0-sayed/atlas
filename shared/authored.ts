import type { AuthoredFeature, ProjectDocument } from './contracts.js'

export const authoredOutcomeLabels = {
  allowed: 'Allowed',
  blocked: 'Blocked',
  unknown: 'Unknown',
  conflicting: 'Conflicting',
} as const

/** Resolves recorded facts only. Condition states never calculate an outcome. */
export function authoredView(
  project: ProjectDocument,
  feature: AuthoredFeature,
  caseId = feature.cases[0]?.id,
) {
  const selected = feature.cases.find((c) => c.id === caseId)
  const actors = new Map(project.actors.map((a) => [a.id, a]))
  const rules = new Map(project.rules.map((r) => [r.id, r]))
  return {
    selected,
    actors: feature.actorIds.map((id) => actors.get(id)!),
    rules: feature.ruleIds.map((id) => rules.get(id)!),
    steps: feature.steps.map((step) => ({
      ...step,
      active: selected?.stepIds.includes(step.id) ?? false,
      actors: step.actorIds.map((id) => actors.get(id)!),
      rules: step.ruleIds.map((id) => rules.get(id)!),
    })),
    conditions: (selected?.conditions ?? []).map((c) => ({
      ...c,
      rule: rules.get(c.ruleId)!,
    })),
  }
}
