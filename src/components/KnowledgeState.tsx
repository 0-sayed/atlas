import { Link } from 'react-router'
import { AtlasHeader } from './AtlasHeader'
import { AtlasSidebar } from './AtlasSidebar'
import { AtlasIcon } from './AtlasIcon'
import './knowledge-state.css'

/** First-load states retain the shared frame without borrowing another project's facts. */
export function KnowledgeState({
  projectId,
  loading,
  error,
  retry,
}: {
  projectId: string
  loading: boolean
  error: string
  retry: () => void
}) {
  const pendingProject = { id: projectId, title: 'Selected project' }
  return (
    <div className="atlas-workspace">
      <AtlasHeader project={pendingProject} />
      <AtlasSidebar project={pendingProject} />
      <section
        className="workspace-content knowledge-state"
        id="workspace-content"
        tabIndex={-1}
      >
        <h1>
          {loading ? 'Opening your project' : 'This project could not load'}
        </h1>
        {loading ? (
          <p role="status">Loading saved guide…</p>
        ) : (
          <p role="alert">{error}</p>
        )}
        <span className="knowledge-state-badge">
          {loading ? 'Project loading' : 'Load unsuccessful'}
        </span>
        <div
          className={`knowledge-state-card ${loading ? '' : 'knowledge-state-error'}`}
        >
          <h2>
            <AtlasIcon name={loading ? 'clock' : 'warning'} />
            {loading ? 'A moment while the guide loads' : 'Nothing to show yet'}
          </h2>
          {loading ? (
            <div className="knowledge-state-loading">
              <div className="knowledge-state-island" aria-hidden="true">
                <img src="/art/penpot/island.png" alt="" />
                <AtlasIcon name="map" />
              </div>
              <h3>The product story is on its way.</h3>
              <p>
                Your saved project knowledge will appear when loading finishes.
              </p>
              <div className="knowledge-skeleton" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : (
            <>
              <p>The project information isn’t available right now.</p>
              <button type="button" className="atlas-button" onClick={retry}>
                Retry
              </button>
            </>
          )}
        </div>
        {!loading && (
          <Link className="atlas-button" to="/">
            Choose a project
          </Link>
        )}
      </section>
    </div>
  )
}
