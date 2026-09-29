import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { z } from 'zod'
import { idSchema } from '../../shared/contracts'
import { projectPath } from '../content/knowledge'
import { AtlasIcon } from '../components/AtlasIcon'
import { DecorativeIsland } from './DecorativeIsland'
import './collection-states.css'

const listSchema = z
  .array(
    z.strictObject({
      id: idSchema,
      title: z.string().min(1).max(160),
      revision: z.number().int().positive(),
    }),
  )
  .max(100)
type Project = z.infer<typeof listSchema>[number]
export function ProjectPicker() {
  const [projects, setProjects] = useState<Project[]>([])
  const [after, setAfter] = useState('')
  const [more, setMore] = useState(false)
  const [request, setRequest] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const empty = !loading && !error && projects.length === 0
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(
          `/api/v1/projects${after ? `?after=${after}` : ''}`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error('Project list unavailable.')
        const result = listSchema.parse(await response.json())
        if (
          result.some(
            (p, index) => p.id <= (index ? result[index - 1].id : after),
          )
        )
          throw new Error('Project list incompatible.')
        if (!controller.signal.aborted) {
          setProjects((old) =>
            after ? [...old.filter((p) => p.id <= after), ...result] : result,
          )
          setMore(result.length === 100)
          setError('')
        }
      } catch {
        if (!controller.signal.aborted)
          setError('Project list unavailable. Retry to load saved guides.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [after, request])
  return (
    <section
      className={`start-page project-picker${empty ? ' project-picker--empty' : ''}`}
      aria-labelledby="page-title"
    >
      {!empty && <p className="eyebrow">Your shelf of discoveries</p>}
      {!empty && <h1 id="page-title">Choose a project</h1>}
      {!empty && (
        <p className="intro">
          Open a guide. Follow a question. See what matters.
        </p>
      )}
      {error && (
        <p role="alert">
          {error}
          {projects.length > 0 && ' Showing the last-loaded list.'}
        </p>
      )}
      {loading && <p role="status">Loading projects…</p>}
      {empty && (
        <div className="project-picker-empty-body">
          <DecorativeIsland withMap />
          <h1 id="page-title">Your product’s story starts here.</h1>
          <p className="project-picker-empty-deck">
            Add reviewed project knowledge to see its activities and
            relationships come to life.
          </p>
          <p className="project-picker-empty-note">
            No projects yet. Your workspace starts empty.
          </p>
        </div>
      )}
      <div className="project-grid">
        {projects.map((p) => (
          <Link
            className="project-card"
            key={p.id}
            to={projectPath(p.id)}
            aria-label={p.title}
          >
            <AtlasIcon name="map" />
            <h2>{p.title}</h2>
            <p>Open guide</p>
          </Link>
        ))}
      </div>
      <div className="picker-actions">
        <button
          disabled={loading}
          onClick={() => {
            setAfter('')
            setLoading(true)
            setRequest((n) => n + 1)
          }}
        >
          {error ? 'Retry' : 'Refresh projects'}
        </button>
        {more && !error && (
          <button
            disabled={loading}
            onClick={() => {
              setLoading(true)
              setAfter(projects.at(-1)!.id)
            }}
          >
            More projects
          </button>
        )}
      </div>
    </section>
  )
}
