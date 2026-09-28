import { Link, NavLink } from 'react-router'
import { destinations } from '../content/project'
import { projectPath } from '../content/knowledge'
import { GuideIcon } from './GuideIcon'

export function AtlasSidebar({
  project,
}: {
  project?: { id: string; title: string }
}) {
  const base = project ? projectPath(project.id) : ''
  return (
    <aside className="atlas-sidebar">
      <Link className="brand" to="/" aria-label="Atlas home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" focusable="false">
            <path
              d="M4 37 16 16l7 11L31 8l13 29Z"
              fill="#61bca8"
              stroke="#173f55"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="m12 23 4-7 7 11 8-19 7 19-7-5-8 8-6-7Z"
              fill="#fffdf5"
              stroke="#173f55"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M31 8V3l7 3-7 3"
              fill="#ee9c6c"
              stroke="#173f55"
              strokeWidth="1.5"
            />
          </svg>
        </span>
        <span>
          Atlas<span className="brand-period">.</span>
        </span>
      </Link>
      <p className="sidebar-caption">A visual guide to how things work</p>
      <nav aria-label="Guide navigation" className="sidebar-navigation">
        <p className="sidebar-section-label">WORKSPACE</p>
        <NavLink className="sidebar-link" to="/" end>
          <span className="sidebar-icon" aria-hidden="true">
            <GuideIcon name="projects" />
          </span>
          Projects
        </NavLink>
        {project && (
          <>
            <div className="sidebar-project" title={project.title}>
              <span className="sidebar-project-kicker">CURRENT PROJECT</span>
              <strong>{project.title}</strong>
            </div>
            <p className="sidebar-section-label">GUIDE</p>
            {destinations.map((item) => (
              <NavLink
                key={item.id}
                className="sidebar-link"
                to={`${base}${item.path === '/' ? '' : item.path}`}
                end={item.path === '/'}
              >
                <span className="sidebar-icon" aria-hidden="true">
                  <GuideIcon name={item.id} />
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
                <GuideIcon name="search" />
              </span>
              Search activities
            </Link>
          </>
        )}
      </nav>
      <div className="sidebar-footer" aria-hidden="true">
        <span className="sidebar-footer-mark">✦</span>
        <p>
          Explore the known.
          <br />
          Notice the unknown.
        </p>
      </div>
    </aside>
  )
}
