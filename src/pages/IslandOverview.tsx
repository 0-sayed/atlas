import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { Feature, ProjectDocument } from '../../shared/contracts'
import { projectPath } from '../content/knowledge'
import { ClaimEvidence } from '../components/ClaimEvidence'
import { AtlasBadge } from '../components/AtlasPrimitives'
import { AtlasActivityIcon, AtlasIcon } from '../components/AtlasIcon'
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
            <h1 id="page-title">Start here</h1>
            <p className="island-overview-deck">
              {project.purpose?.text ??
                'Explore the saved activities that shape this guide.'}
            </p>
            {project.purpose && (
              <ClaimEvidence ids={project.purpose.evidenceIds} />
            )}
          </div>
          <p className="island-overview-count">
            <strong>{project.features.length}</strong> saved{' '}
            {project.features.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>
      </div>

      <div className="island-overview-body">
        <div className="island-sea" aria-label="Illustrated activity overview">
          <img
            className="island-panorama"
            src="/art/penpot/panorama.png"
            alt=""
          />
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
                      src="/art/penpot/island.png"
                      alt=""
                      loading={index > 3 ? 'lazy' : 'eager'}
                    />
                    <AtlasActivityIcon feature={feature} />
                  </div>
                  <span className="island-name">
                    <span>{feature.title}</span>
                  </span>
                  <span
                    className="island-evidence"
                    id={`island-evidence-${feature.id}`}
                  >
                    <AtlasBadge>
                      {feature.evidence.status === 'demo'
                        ? 'Illustrative fixture'
                        : feature.evidence.status === 'uncertain'
                          ? 'Uncertain evidence'
                          : 'Source-supported'}
                    </AtlasBadge>
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
              className="island-show-more atlas-button"
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
        </div>

        <aside
          className="island-summary"
          aria-labelledby="island-summary-title"
        >
          <div className="island-summary-top">
            <div className="island-summary-heading">
              <AtlasIcon name="map" />
              <h2 id="island-summary-title">
                {isAuthoredSelection
                  ? 'Your key activities.'
                  : 'Saved activities.'}
              </h2>
            </div>
            <p>
              {essentials.length
                ? isAuthoredSelection
                  ? 'A few starting points. Open an activity to see how it works.'
                  : 'No starting selection was saved. These activities are shown in stable order; open one for its cases and evidence.'
                : 'This project has no saved activities to explore yet.'}
            </p>
          </div>

          {essentials.length > 0 && (
            <ol className="island-summary-list">
              {visibleActivities.map((feature) => (
                <li key={feature.id}>
                  <Link to={featureHref(feature)}>
                    <AtlasActivityIcon feature={feature} />
                    <span className="island-summary-copy">
                      <strong>{feature.title}</strong>
                      <span>{feature.purpose}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}

          <Link className="atlas-button" to={explorePath}>
            Explore all activities
          </Link>
        </aside>
      </div>
    </section>
  )
}
