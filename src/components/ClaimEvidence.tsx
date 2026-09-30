import { useProject } from '../content/knowledge'

/** Keep important uncertainty beside its claim; shared source details live outside cards. */
export function ClaimEvidence({ ids }: { ids: string[] }) {
  const project = useProject()
  const warnings = ids
    .map((id) => project.evidenceRecords.find((e) => e.id === id)!)
    .filter((e) => e.status === 'uncertain' || e.status === 'conflicting')
  if (!warnings.length) return null
  return (
    <div className="claim-evidence">
      {warnings.map((evidence) => (
        <p className="claim-warning" key={evidence.id}>
          <strong>
            {evidence.status === 'conflicting'
              ? 'Conflicting evidence'
              : 'Uncertain evidence'}
            :
          </strong>{' '}
          {evidence.description}
        </p>
      ))}
    </div>
  )
}
