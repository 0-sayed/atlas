import { Link, NavLink, Route, Routes } from 'react-router'
import { destinations } from './content/project'

function FoundationPage({ id }: { id: (typeof destinations)[number]['id'] }) {
  const destination = destinations.find((item) => item.id === id)!

  return (
    <section className="page-panel" aria-labelledby="page-title">
      <div className="page-copy">
        <p className="eyebrow">Atlas / Foundation</p>
        <h1 id="page-title">{destination.label}</h1>
        <p className="intro">{destination.description}</p>
        <p className="status-note">
          This section is a foundation view. No live product data or verified
          source rules are shown yet.
        </p>
        {id === 'start' && (
          <Link className="primary-link" to="/explore">
            See what is planned <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>
      <div className="scene-placeholder" aria-hidden="true">
        <div className="orbit orbit-outer" />
        <div className="orbit orbit-inner" />
        <div className="scene-center">
          <span>✦</span>
        </div>
        <div className="scene-dot dot-one" />
        <div className="scene-dot dot-two" />
      </div>
    </section>
  )
}

function MissingPage() {
  return (
    <section className="page-panel missing-panel" aria-labelledby="page-title">
      <div className="page-copy">
        <p className="eyebrow">Atlas / Unavailable</p>
        <h1 id="page-title">This guide is not here yet</h1>
        <p className="intro">
          This link does not point to an available Atlas guide. Activities and
          cases will be added as they are reviewed and built.
        </p>
        <Link className="primary-link" to="/explore">
          Return to Explore <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="site-shell">
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
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          {destinations.map((destination) => (
            <Route
              key={destination.id}
              path={destination.path}
              element={<FoundationPage id={destination.id} />}
            />
          ))}
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>Atlas is taking shape.</span>
        <span>Illustrated guides will be added in the next task.</span>
      </footer>
    </div>
  )
}
