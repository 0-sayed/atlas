import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { Feature, ProjectDocument } from '../../shared/contracts'
import { projectPath } from '../content/knowledge'
import { ActivitySubject } from '../scenes/ActivityArt'
import './island-overview.css'

type IslandOverviewProps = {
  project: ProjectDocument
  essentials: Feature[]
  isAuthoredSelection: boolean
  featureHref: (feature: Feature) => string
  fixtureLabel: ReactNode
}

const expandedCounts = new Map<string, number>()

export function IslandOverview({
  project,
  essentials,
  isAuthoredSelection,
  featureHref,
  fixtureLabel,
}: IslandOverviewProps) {
  const explorePath = `${projectPath(project.id)}/explore`
  const changesPath = `${projectPath(project.id)}/changes`
  const [visibleCount, setVisibleCount] = useState(
    () => expandedCounts.get(project.id) ?? 6,
  )
  const visibleActivities = essentials.slice(0, visibleCount)

  return (
    <section className="island-overview" aria-labelledby="page-title">
      <div className="island-overview-header">
        {fixtureLabel}
        <div className="island-overview-intro">
          <div>
            <p className="island-overview-kicker">AN ATLAS OF YOUR PROJECT</p>
            <h1 id="page-title">Start here</h1>
            <p className="island-overview-deck">
              Explore the saved activities that shape this guide.
            </p>
          </div>
          <p className="island-overview-count">
            <strong>{project.features.length}</strong> saved{' '}
            {project.features.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>
      </div>

      <div className="island-overview-body">
        <div className="island-sea" aria-label="Illustrated activity overview">
          <div className="island-sea-glow" aria-hidden="true" />
          {essentials.length ? (
            <div className="island-field">
              {visibleActivities.map((feature, index) => (
                <Link
                  className="activity-hero island-link"
                  key={feature.id}
                  to={featureHref(feature)}
                  aria-label={feature.title}
                  aria-describedby={`island-evidence-${feature.id}`}
                >
                  <div className="hero-art island-hero-art">
                    <img
                      className="island-terrain"
                      src="/art/atlas-island.png"
                      alt=""
                      loading={index > 3 ? 'lazy' : 'eager'}
                    />
                    <ActivitySubject feature={feature} />
                  </div>
                  <span className="island-name">
                    <span className="island-name-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{feature.title}</span>
                    <span className="island-name-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                  <span
                    className="island-evidence"
                    id={`island-evidence-${feature.id}`}
                  >
                    {feature.evidence.status === 'demo'
                      ? 'Illustrative fixture'
                      : feature.evidence.status === 'uncertain'
                        ? 'Uncertain evidence'
                        : 'Source-supported'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="island-empty">
              <h2>No activities incorporated yet</h2>
              <p>
                This saved guide does not establish any product behavior yet.
              </p>
            </div>
          )}
          {visibleActivities.length < essentials.length && (
            <button
              className="island-show-more"
              onClick={() => {
                const next = visibleCount + 6
                expandedCounts.set(project.id, next)
                setVisibleCount(next)
              }}
            >
              Showing {visibleActivities.length} of {essentials.length} · Show
              more activities
            </button>
          )}
          <div className="island-sea-bottom">
            <span>Explore the recorded details</span>
            <Link to={changesPath}>
              Recent changes <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <aside
          className="island-summary"
          aria-labelledby="island-summary-title"
        >
          <div className="island-summary-top">
            <span className="island-summary-mark" aria-hidden="true">
              ✳
            </span>
            <p className="island-overview-kicker">THE GUIDE AT A GLANCE</p>
            <h2 id="island-summary-title">
              {isAuthoredSelection ? 'Your key areas.' : 'Saved activities.'}
              <br />A fuller picture.
            </h2>
            <p>
              {essentials.length
                ? isAuthoredSelection
                  ? 'These selected activities introduce the saved guide. Open one to inspect its cases and evidence.'
                  : 'No starting selection was saved. These activities are shown in stable order; open one for its cases and evidence.'
                : 'This project has no saved activities to explore yet.'}
            </p>
          </div>

          {essentials.length > 0 && (
            <ol className="island-summary-list">
              {visibleActivities.map((feature, index) => (
                <li key={feature.id}>
                  <Link to={featureHref(feature)}>
                    <span className="island-summary-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="island-summary-copy">
                      <strong>{feature.title}</strong>
                      <span>{feature.purpose}</span>
                    </span>
                    <span className="island-summary-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}

          <div className="island-summary-next">
            <span className="island-summary-compass" aria-hidden="true">
              ✦
            </span>
            <div>
              <strong>Keep exploring</strong>
              <p>Find every saved activity in this project.</p>
            </div>
          </div>
          <Link className="island-summary-cta" to={explorePath}>
            Explore all activities <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
    </section>
  )
}
