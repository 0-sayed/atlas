import { useEffect, useState, type ReactNode } from 'react'
import { KnowledgeState } from '../components/KnowledgeState'
import { validateDocument, type ProjectDocument } from '../../shared/contracts'
import { ProjectContext, RefreshContext } from './knowledge'
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
  const refresh = () => {
    setLoading(true)
    setRequest((n) => n + 1)
  }
  return document ? (
    <ProjectContext.Provider value={document}>
      <RefreshContext.Provider value={{ refresh, loading, error }}>
        {children}
      </RefreshContext.Provider>
    </ProjectContext.Provider>
  ) : (
    <KnowledgeState
      projectId={projectId}
      loading={loading}
      error={error}
      retry={refresh}
    />
  )
}
