import { useLocation } from 'react-router'
import { useProject } from '../content/knowledge'
import { projectSources } from '../content/sources'
import './project-sources.css'

const statusLabels = {
  demo: 'Demo example',
  supported: 'Reviewed source',
  uncertain: 'Not verified',
  conflicting: 'Sources disagree',
}

export function ProjectSources() {
  const project = useProject()
  const location = useLocation()
  const sources = projectSources(project)
  if (!sources.length) return null
  return (
    <details
      className="detail-panel project-sources"
      key={project.id + location.pathname}
    >
      <summary>Sources</summary>
      <p>Where this guide’s information comes from.</p>
      {sources.map(({ evidence, claims }) => (
        <section
          className="project-source"
          key={evidence.id}
          data-source-id={evidence.id}
        >
          <h3>{evidence.source}</h3>
          <p className="source-status">{statusLabels[evidence.status]}</p>
          <p>{evidence.description}</p>
          <dl className="evidence-fields">
            <dt>Reviewed version</dt>
            <dd>{evidence.sourceRevision}</dd>
            <dt>Applies to</dt>
            <dd>{evidence.scope}</dd>
          </dl>
          {claims.length ? (
            <>
              <h4>Used for</h4>
              <ul>
                {claims.map((label, index) => (
                  <li key={index}>{label}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>No saved facts reference this source.</p>
          )}
        </section>
      ))}
    </details>
  )
}
