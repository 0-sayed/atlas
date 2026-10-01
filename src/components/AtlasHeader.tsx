import { Link } from 'react-router'
import { useContext } from 'react'
import { AtlasIcon } from './AtlasIcon'
import { ProjectSwitcher } from './ProjectSwitcher'
import { RefreshContext } from '../content/knowledge'

export function AtlasHeader({
  project,
}: {
  project?: { id: string; title: string }
}) {
  const refresh = useContext(RefreshContext)
  return (
    <header className="atlas-header" role="banner">
      <Link className="brand" to="/" aria-label="Atlas home">
        <span className="brand-mark" aria-hidden="true">
          <AtlasIcon name="mountain" />
        </span>
        <span>Feature Atlas</span>
      </Link>
      <ProjectSwitcher project={project} />
      <p className="atlas-header-caption">
        Understand the product, one island at a time.
      </p>
      {refresh && (
        <button
          className="atlas-button atlas-refresh"
          type="button"
          onClick={refresh.refresh}
          disabled={refresh.loading}
        >
          Refresh guide
        </button>
      )}
    </header>
  )
}
