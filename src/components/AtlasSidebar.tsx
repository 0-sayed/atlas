import { Link, NavLink } from 'react-router'
import { destinations } from '../content/project'
import { projectPath } from '../content/knowledge'
import { AtlasIcon } from './AtlasIcon'

export function AtlasSidebar({
  project,
}: {
  project?: { id: string; title: string }
}) {
  const base = project ? projectPath(project.id) : ''
  return (
    <aside className="atlas-sidebar">
      <nav aria-label="Guide navigation" className="sidebar-navigation">
        <p className="sidebar-section-label">WORKSPACE</p>
        <NavLink className="sidebar-link" to="/" end>
          <span className="sidebar-icon" aria-hidden="true">
            <AtlasIcon name="map" />
          </span>
          Projects
        </NavLink>
        {project && (
          <>
            <p className="sidebar-section-label">GUIDE</p>
            {destinations.map((item) => (
              <NavLink
                key={item.id}
                className="sidebar-link"
                to={`${base}${item.path === '/' ? '' : item.path}`}
                end={item.path === '/'}
              >
                <span className="sidebar-icon" aria-hidden="true">
                  <AtlasIcon name={item.id === 'start' ? 'map' : 'compass'} />
                </span>
                {item.label}
              </NavLink>
            ))}
            <Link
              className="sidebar-link sidebar-search"
              to={`${base}/explore`}
              aria-label="Search activities"
            >
              <span className="sidebar-icon" aria-hidden="true">
                <AtlasIcon name="search" />
              </span>
              Search activities
            </Link>
          </>
        )}
      </nav>
      <div className="sidebar-footer" aria-hidden="true">
        <div className="sidebar-landmark">
          <img src="/art/penpot/island.png" alt="" />
          <AtlasIcon name="mountain" />
        </div>
      </div>
    </aside>
  )
}
