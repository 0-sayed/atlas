import { useEffect, useState, type ReactNode } from 'react'
import { validateDocument, type ProjectDocument } from '../../shared/contracts'
import { ProjectContext } from './knowledge'
export function KnowledgeProvider({
  children,
  projectId,
}: {
  children: ReactNode
  projectId: string
}) {
  const [document, setDocument] = useState<ProjectDocument | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(
          `/api/v1/projects/${encodeURIComponent(projectId)}`,
          {
            signal: controller.signal,
          },
        )
        if (!response.ok)
          throw new Error(
            response.status === 404
              ? 'Project unavailable. No saved guide has this identity.'
              : 'Guide unavailable. The local API could not load it.',
          )
        let doc: ProjectDocument
        try {
          doc = validateDocument(await response.json())
        } catch {
          throw new Error(
            'Guide incompatible. Its contract or scene version is unsupported.',
          )
        }
        if (doc.id !== projectId)
          throw new Error(
            'Guide incompatible. Project identity does not match.',
          )
        if (!controller.signal.aborted) {
          setDocument(doc)
          setError('')
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error && error.message !== 'Failed to fetch'
              ? error.message
              : 'Guide unavailable. The local API could not load it.',
          )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [request, projectId])
  return (
    <>
      <div className="knowledge-status">
        {error && (
          <p role="alert">
            {error}
            {document
              ? ` Showing last-loaded revision ${document.revision}.`
              : ''}
          </p>
        )}
        {loading && <p role="status">Loading saved guide…</p>}
        {!loading && (
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              setRequest((n) => n + 1)
            }}
          >
            {document ? 'Refresh guide' : 'Retry'}
          </button>
        )}
      </div>
      {document ? (
        <ProjectContext.Provider value={document}>
          {children}
        </ProjectContext.Provider>
      ) : null}
    </>
  )
}
