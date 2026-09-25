import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router'
import { NavigationScroll } from './components/NavigationScroll'
import { KnowledgeProvider } from './content/KnowledgeProvider'
import { destinations } from './content/project'
import { StartPage, ExplorePage, MissingPage } from './pages/GuidePages'
import { ChangesPage } from './pages/ChangesPage'
import { FeaturePage } from './pages/FeaturePage'
import { ProjectPicker } from './pages/ProjectPicker'

function ProjectGuide() {
  const { projectId = '' } = useParams()
  const base = `/projects/${projectId}`
  return (
    <>
      <nav className="project-nav" aria-label="Main navigation">
        {destinations.map((item) => (
          <NavLink
            key={item.id}
            to={`${base}${item.path === '/' ? '' : item.path}`}
            end={item.path === '/'}
          >
            {item.label}
          </NavLink>
        ))}
        <Link to={`${base}/explore`} aria-label="Search activities">
          ⌕ Search
        </Link>
      </nav>
      <KnowledgeProvider key={projectId} projectId={projectId}>
        <Routes>
          <Route index element={<StartPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="explore/:featureId" element={<FeaturePage />} />
          <Route path="changes" element={<ChangesPage />} />
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </KnowledgeProvider>
    </>
  )
}
function LegacyRoute() {
  const location = useLocation()
  return (
    <Navigate
      replace
      to={`/projects/booking-demo${location.pathname}${location.search}`}
    />
  )
}
export default function App() {
  return (
    <div className="site-shell">
      <NavigationScroll />
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Atlas home">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>{' '}
          Atlas
        </Link>
        <Link className="header-search" to="/">
          Projects
        </Link>
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ProjectPicker />} />
          <Route path="/projects/:projectId/*" element={<ProjectGuide />} />
          <Route path="/explore/*" element={<LegacyRoute />} />
          <Route path="/changes" element={<LegacyRoute />} />
          <Route
            path="*"
            element={
              <section className="missing-page">
                <h1>This page is unavailable</h1>
                <Link to="/">Choose a project</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>Atlas · A visual guide to how things work</span>
        <span>Saved knowledge. No live product connection.</span>
      </footer>
    </div>
  )
}
