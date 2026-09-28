import { Link, Navigate, Route, Routes, useParams } from 'react-router'
import { AtlasSidebar } from './components/AtlasSidebar'
import { NavigationScroll } from './components/NavigationScroll'
import { KnowledgeProvider } from './content/KnowledgeProvider'
import { useProject } from './content/knowledge'
import { StartPage, ExplorePage, MissingPage } from './pages/GuidePages'
import { ChangesPage } from './pages/ChangesPage'
import { FeaturePage } from './pages/FeaturePage'
import { ProjectPicker } from './pages/ProjectPicker'

function ProjectWorkspace() {
  const project = useProject()
  return (
    <div className="atlas-workspace">
      <AtlasSidebar project={project} />
      <div className="workspace-content">
        <Routes>
          <Route index element={<StartPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="explore/:featureId" element={<FeaturePage />} />
          <Route path="changes" element={<ChangesPage />} />
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </div>
    </div>
  )
}
function ProjectGuide() {
  const { projectId = '' } = useParams()
  return (
    <KnowledgeProvider key={projectId} projectId={projectId}>
      <ProjectWorkspace />
    </KnowledgeProvider>
  )
}
function ProjectSelection() {
  return (
    <div className="atlas-workspace">
      <AtlasSidebar />
      <div className="workspace-content">
        <ProjectPicker />
      </div>
    </div>
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
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ProjectSelection />} />
          <Route path="/projects/:projectId/*" element={<ProjectGuide />} />
          <Route path="/explore/*" element={<Navigate replace to="/" />} />
          <Route path="/changes" element={<Navigate replace to="/" />} />
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
        <span>Atlas · A guide to saved product knowledge</span>
        <span>Saved knowledge. No live product connection.</span>
      </footer>
    </div>
  )
}
