import { Link, Navigate, Route, Routes, useParams } from 'react-router'
import { useContext } from 'react'
import { AtlasIcon } from './components/AtlasIcon'
import { AtlasHeader } from './components/AtlasHeader'
import { AtlasSidebar } from './components/AtlasSidebar'
import { NavigationScroll } from './components/NavigationScroll'
import { KnowledgeProvider } from './content/KnowledgeProvider'
import { RefreshContext, useProject } from './content/knowledge'
import { StartPage, ExplorePage, MissingPage } from './pages/GuidePages'
import { FeaturePage } from './pages/FeaturePage'
import { FeatureMapPage } from './pages/FeatureMapPage'
import { KnowledgePage } from './pages/KnowledgePages'
import { ProjectPicker } from './pages/ProjectPicker'
import { ProjectSources } from './components/ProjectSources'

function ProjectWorkspace() {
  const project = useProject()
  const refresh = useContext(RefreshContext)
  return (
    <div className="atlas-workspace">
      <AtlasHeader project={project} />
      <AtlasSidebar project={project} />
      <div className="workspace-content" id="workspace-content" tabIndex={-1}>
        {refresh?.error && (
          <div className="workspace-refresh-notice">
            <AtlasIcon name="warning" />
            <p role="alert">
              {refresh.error} Showing last-loaded revision {project.revision}.
            </p>
          </div>
        )}
        {refresh?.loading && <p role="status">Loading saved guide…</p>}
        <Routes>
          <Route index element={<StartPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="map" element={<FeatureMapPage />} />
          <Route
            path="actors"
            element={<KnowledgePage destination="actors" />}
          />
          <Route path="rules" element={<KnowledgePage destination="rules" />} />
          <Route
            path="journeys"
            element={<KnowledgePage destination="journeys" />}
          />
          <Route
            path="glossary"
            element={<KnowledgePage destination="glossary" />}
          />
          <Route path="explore/:featureId" element={<FeaturePage />} />
          <Route path="*" element={<MissingPage />} />
        </Routes>
        <ProjectSources />
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
      <AtlasHeader />
      <AtlasSidebar />
      <div className="workspace-content" id="workspace-content" tabIndex={-1}>
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
        href="#workspace-content"
        onClick={(event) => {
          event.preventDefault()
          const target =
            document.getElementById('workspace-content') ??
            document.getElementById('main')
          target?.focus()
        }}
      >
        Skip to content
      </a>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ProjectSelection />} />
          <Route path="/projects/:projectId/*" element={<ProjectGuide />} />
          <Route path="/explore/*" element={<Navigate replace to="/" />} />
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
