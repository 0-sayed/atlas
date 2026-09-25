import { Link, NavLink, Route, Routes } from 'react-router'
import { NavigationScroll } from './components/NavigationScroll'
import { KnowledgeProvider } from './content/KnowledgeProvider'
import { destinations } from './content/project'
import { BookingPage } from './pages/BookingPage'
import {
  ChangesPage,
  ExplorePage,
  MissingPage,
  StartPage,
} from './pages/GuidePages'

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
        <nav className="site-nav" aria-label="Main navigation">
          {destinations.map((destination) => (
            <NavLink
              key={destination.id}
              to={destination.path}
              end={destination.path === '/'}
            >
              {destination.label}
            </NavLink>
          ))}
        </nav>
        <Link
          className="header-search"
          to="/explore"
          aria-label="Search activities"
        >
          <span aria-hidden="true">⌕</span> Search
        </Link>
      </header>
      <main id="main" tabIndex={-1}>
        <KnowledgeProvider>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/explore/booking" element={<BookingPage />} />
            <Route path="/changes" element={<ChangesPage />} />
            <Route path="*" element={<MissingPage />} />
          </Routes>
        </KnowledgeProvider>
      </main>
      <footer className="site-footer">
        <span>Atlas · A visual guide to how things work</span>
        <span>Illustrative content. No live product connection.</span>
      </footer>
    </div>
  )
}
