import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { projectPath } from '../content/knowledge'
import { loadProjectPage, type SavedProject } from '../content/projectList'

export function ProjectSwitcher({
  project,
}: {
  project?: { id: string; title: string }
}) {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [request, setRequest] = useState(0)
  const prompt = loading
    ? 'Loading projects…'
    : error
      ? 'Project list unavailable'
      : projects.length === 0
        ? 'No projects yet'
        : 'Choose a project'
  const selectedTitle = project?.title ?? prompt
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const saved: SavedProject[] = []
        let after = ''
        for (;;) {
          const page = await loadProjectPage(after, controller.signal)
          saved.push(...page)
          if (page.length < 100) break
          after = page[page.length - 1].id
        }
        if (!controller.signal.aborted) {
          setProjects(saved)
          setError(false)
        }
      } catch {
        if (!controller.signal.aborted) setError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [request])

  return (
    <div className="atlas-project-switcher">
      <select
        className="atlas-project-control"
        aria-label={`Choose project${project ? `: ${project.title}` : ''}`}
        aria-busy={loading}
        title={project?.title}
        value={project?.id ?? ''}
        disabled={loading || error || projects.length === 0}
        onChange={(event) => navigate(projectPath(event.target.value))}
      >
        <button type="button" className="atlas-project-selection">
          <span className="atlas-project-value">{selectedTitle}</span>
        </button>
        {!project && (
          <option value="" disabled hidden>
            {prompt}
          </option>
        )}
        {project && !projects.some((saved) => saved.id === project.id) && (
          <option value={project.id} disabled>
            {project.title}
          </option>
        )}
        {projects.map((saved) => (
          <option key={saved.id} value={saved.id}>
            {saved.id === project?.id ? project.title : saved.title}
          </option>
        ))}
      </select>
      {error && (
        <div className="atlas-project-error">
          <p role="alert">Project list unavailable.</p>
          <button
            className="atlas-button"
            type="button"
            disabled={loading}
            onClick={() => {
              setLoading(true)
              setRequest((value) => value + 1)
            }}
          >
            Retry projects
          </button>
        </div>
      )}
    </div>
  )
}
