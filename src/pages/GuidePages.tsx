import { featureReturn } from '../content/destinations'
import { Link, useSearchParams } from 'react-router'
import type { Feature } from '../../shared/contracts'
import { useProject, projectPath } from '../content/knowledge'
import { AtlasActivityIcon, AtlasIcon } from '../components/AtlasIcon'
import { IslandOverview } from './IslandOverview'
import { DecorativeIsland } from './DecorativeIsland'
import { ClaimEvidence } from '../components/ClaimEvidence'
import './collection-states.css'
import { searchFeatures, featureGroup } from '../../shared/exploration'

export function FixtureLabel({ feature }: { feature?: Feature }) {
  const project = useProject()
  return (
    <p className="fixture-label">
      {feature
        ? `${feature.evidence.status === 'demo' ? 'Illustrative fixture' : feature.evidence.status === 'uncertain' ? 'Uncertain evidence' : 'Source-supported guide'} · ${feature.revisionLabel}`
        : project.title}{' '}
      · Atlas revision {project.revision} · No live product connection
    </p>
  )
}
function featureLink(
  projectId: string,
  feature: Feature,
  from: string,
  query = '',
) {
  const caseId = feature.cases[0]?.id ?? ''
  const params = new URLSearchParams({ from })
  if (caseId) params.set('case', caseId)
  if (query) params.set('q', query)
  return `${projectPath(projectId)}/explore/${feature.id}?${params}`
}
export function EmptyGuide() {
  return (
    <div className="collection-empty-guide">
      <div className="collection-empty-panel">
        <h2>
          <AtlasIcon name="map" /> What this guide can say
        </h2>
        <DecorativeIsland />
        <h3>There is no behavior to explain yet.</h3>
        <p>This saved guide does not establish any product behavior yet.</p>
      </div>
      <div className="collection-next-panel">
        <h2>
          <AtlasIcon name="link" /> When an activity is incorporated
        </h2>
        <p>
          Reviewed behavior will appear here when it is added to this project.
        </p>
      </div>
    </div>
  )
}
export function StartPage() {
  const project = useProject()
  const selected = project.features.filter(
    (feature) => feature.essentialOrder !== undefined,
  )
  const essentials = selected.length
    ? [...selected].sort(
        (a, b) =>
          a.essentialOrder! - b.essentialOrder! || a.id.localeCompare(b.id),
      )
    : [...project.features].sort((a, b) => a.id.localeCompare(b.id))
  if (project.features.length === 0) {
    return (
      <section className="scaffold-guide" aria-labelledby="page-title">
        <FixtureLabel />
        <h1 id="page-title">No implemented activities found</h1>
        {project.purpose && (
          <>
            <p className="intro">{project.purpose.text}</p>
            <ClaimEvidence ids={project.purpose.evidenceIds} />
          </>
        )}
        <p className="intro">
          This project has no reviewed, implemented activities yet.
        </p>
        <EmptyGuide />
      </section>
    )
  }
  return (
    <IslandOverview
      project={project}
      essentials={essentials}
      isAuthoredSelection={selected.length > 0}
      featureHref={(feature) => featureLink(project.id, feature, 'start')}
      fixtureLabel={<FixtureLabel />}
    />
  )
}
export function ExplorePage() {
  const project = useProject()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const matches = searchFeatures(project, query)
  const groups = new Map<string, Feature[]>()
  for (const feature of matches) {
    const group = featureGroup(project, feature)
    groups.set(group, [...(groups.get(group) ?? []), feature])
  }
  return (
    <section
      className="explore-page collection-page"
      aria-labelledby="page-title"
    >
      <FixtureLabel />
      <h1 id="page-title">
        {project.features.length > 0 && query.trim() && matches.length === 0
          ? `No activity matched “${query.trim()}”`
          : 'Browse recorded activities'}
      </h1>
      <p className="intro">
        {project.features.length > 0 && query.trim() && matches.length === 0
          ? 'Try a different search or browse all activities.'
          : 'Explore the activities recorded for this project.'}
      </p>
      <span className="collection-status-badge">
        {project.features.length === 0
          ? 'No activities'
          : query.trim() && matches.length === 0
            ? 'No matches'
            : `${matches.length} recorded ${matches.length === 1 ? 'activity' : 'activities'}`}
      </span>
      <form
        role="search"
        className="search-form collection-search"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="collection-visually-hidden" htmlFor="activity-search">
          Search activities
        </label>
        <div className="search-row">
          <AtlasIcon name="search" />
          <input
            id="activity-search"
            type="search"
            placeholder="Search activities, cases, or areas"
            value={query}
            onChange={(e) =>
              setParams(e.target.value ? { q: e.target.value } : {}, {
                replace: true,
              })
            }
          />
        </div>
      </form>
      {!project.features.length ? (
        <EmptyGuide />
      ) : matches.length === 0 ? (
        <div className="collection-no-results">
          <h2>
            <AtlasIcon name="compass" /> No matching activities
          </h2>
          <DecorativeIsland />
          <h3>Try another name or explore by area.</h3>
          <p>Your search for “{query.trim()}” found no activities.</p>
          <button
            className="atlas-button collection-reset"
            type="button"
            onClick={() => setParams({}, { replace: true })}
          >
            Return to all activities
          </button>
        </div>
      ) : (
        <>
          {query && (
            <button
              className="collection-clear"
              type="button"
              onClick={() => setParams({}, { replace: true })}
            >
              Clear search
            </button>
          )}
          {[...groups].map(([group, features], index) => (
            <div className="activity-group collection-group" key={group}>
              <h2
                className="collection-group-badge"
                data-tone={index % 3}
                aria-label={`${group}, ${features.length} ${features.length === 1 ? 'activity' : 'activities'}`}
              >
                {group}
              </h2>
              <div className="collection-grid">
                {features.map((feature) => (
                  <Link
                    className="activity-card collection-card"
                    aria-label={feature.title}
                    key={feature.id}
                    to={featureLink(project.id, feature, 'explore', query)}
                  >
                    <AtlasActivityIcon feature={feature} />
                    <div className="collection-card-copy">
                      <h3>{feature.title}</h3>
                      <p>{feature.purpose}</p>
                      <span className="revision-note">
                        {feature.evidence.status === 'demo'
                          ? 'Illustrative fixture'
                          : feature.evidence.status === 'uncertain'
                            ? 'Uncertain evidence'
                            : 'Source-supported'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  )
}
export function MissingPage() {
  const project = useProject()
  const [params] = useSearchParams()
  const back = featureReturn(project.id, params)
  return (
    <section className="missing-page" aria-labelledby="page-title">
      <p className="eyebrow">Atlas / Unavailable</p>
      <h1 id="page-title">This guide is not here yet</h1>
      <div className="collection-next-panel collection-unavailable">
        <h2>
          <AtlasIcon name="warning" /> Activity unavailable
        </h2>
        <p className="intro">
          This link does not point to an available activity or saved case.
        </p>
        <Link
          className="primary-link"
          to={back.to}
          state={{ restorePosition: true }}
        >
          Return to {back.label}
        </Link>
      </div>
    </section>
  )
}
