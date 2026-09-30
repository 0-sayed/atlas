import { originParams } from '../content/destinations'
import { Link, useSearchParams } from 'react-router'
import type { Feature } from '../../shared/contracts'
import { relationshipLabel } from '../../shared/relationships'
import { ClaimEvidence } from './ClaimEvidence'
import { projectPath, useProject } from '../content/knowledge'

export function FeatureEvidence({ feature }: { feature: Feature }) {
  const project = useProject()
  const [params] = useSearchParams()
  const origin = originParams(params)
  const relatedParams = origin.params
  if (params.has('from')) relatedParams.set('from', origin.origin)
  const relations = project.relations.filter(
    (r) => r.from === feature.id || r.to === feature.id,
  )
  return (
    <>
      <h3>About this evidence</h3>
      <p>{feature.evidence.description}</p>
      <dl className="evidence-fields">
        <dt>Source</dt>
        <dd>{feature.evidence.source}</dd>
        <dt>Inspected revision</dt>
        <dd>{feature.evidence.sourceRevision}</dd>
        <dt>Scope</dt>
        <dd>{feature.evidence.scope}</dd>
      </dl>
      <p className="revision-note">
        {feature.revisionLabel} · Atlas revision {project.revision} · Not proof
        of production availability.
      </p>
      {relations.length > 0 && (
        <>
          <h3>Related behavior</h3>
          <ul>
            {relations.map((r) => {
              const outgoing = r.from === feature.id
              const other = project.features.find(
                (f) => f.id === (outgoing ? r.to : r.from),
              )!
              const label = relationshipLabel(r.kind, outgoing)
              return (
                <li key={r.id}>
                  {label}:{' '}
                  <Link
                    to={`${projectPath(project.id)}/explore/${other.id}${relatedParams.size ? `?${relatedParams}` : ''}`}
                  >
                    {other.title}
                  </Link>
                  {r.evidenceIds && <ClaimEvidence ids={r.evidenceIds} />}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </>
  )
}
