import { Link, useSearchParams } from 'react-router'
import { isBookingFeature, type Feature } from '../../shared/contracts'
import { useProject, projectPath } from '../content/knowledge'
import { CalendarArt } from '../scenes/BookingScene'
import { ApprovalArt } from '../scenes/ApprovalScene'

export function FixtureLabel({ feature }: { feature?: Feature }) {
  const project = useProject()
  return (
    <p className="fixture-label">
      <span aria-hidden="true">◇</span>{' '}
      {feature
        ? `${feature.evidence.status === 'demo' ? 'Illustrative fixture' : feature.evidence.status === 'uncertain' ? 'Uncertain evidence' : 'Source-supported guide'} · ${feature.revisionLabel}`
        : project.title}{' '}
      · Atlas revision {project.revision} · No live product connection
    </p>
  )
}
export function FeatureArt({ feature }: { feature: Feature }) {
  return isBookingFeature(feature) ? <CalendarArt /> : <ApprovalArt />
}
function featureLink(
  projectId: string,
  feature: Feature,
  from: string,
  query = '',
) {
  const caseId =
    feature.cases[0]?.id ?? (isBookingFeature(feature) ? 'change-now' : '')
  const params = new URLSearchParams({ from })
  if (caseId) params.set('case', caseId)
  if (query) params.set('q', query)
  return `${projectPath(projectId)}/explore/${feature.id}?${params}`
}
export function EmptyGuide() {
  return (
    <div className="empty-search">
      <h2>No activities incorporated yet</h2>
      <p>This saved guide does not establish any product behavior yet.</p>
    </div>
  )
}
export function StartPage() {
  const project = useProject()
  const essentials = [...project.features]
    .sort(
      (a, b) =>
        (a.essentialOrder ?? 100) - (b.essentialOrder ?? 100) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 3)
  return (
    <section className="start-page" aria-labelledby="page-title">
      <FixtureLabel />
      <div className="start-intro">
        <p className="eyebrow">A little exploration. A clearer picture.</p>
        <h1 id="page-title">Start here</h1>
        <p className="intro">
          See what a product lets you do.
          <br />
          Find out what changes the outcome.
        </p>
      </div>
      {essentials.length === 0 ? (
        <EmptyGuide />
      ) : (
        essentials.map((feature, index) => (
          <Link
            key={feature.id}
            className="activity-hero"
            to={featureLink(project.id, feature, 'start')}
          >
            <div className="hero-art">
              <FeatureArt feature={feature} />
              <span className="art-spark" aria-hidden="true">
                ✦
              </span>
            </div>
            <div className="activity-copy">
              <p className="eyebrow">
                {String(index + 1).padStart(2, '0')} /{' '}
                {feature.group ??
                  (isBookingFeature(feature) ? 'Bookings' : 'Reviews')}
              </p>
              <h2>{feature.title}</h2>
              <p>{feature.purpose}</p>
              <p>
                {isBookingFeature(feature)
                  ? `At least ${feature.noticeHours} hours’ notice`
                  : `At least ${feature.requiredApprovals} independent approvals`}
              </p>
              <p className="revision-note">
                {feature.evidence.status === 'demo'
                  ? 'Illustrative fixture'
                  : feature.evidence.status === 'uncertain'
                    ? 'Uncertain evidence'
                    : 'Source-supported'}
              </p>
              <span className="text-link">Explore the story ↗</span>
            </div>
          </Link>
        ))
      )}
      {essentials.length > 0 && (
        <p className="start-note">
          Select a saved case to see what matters.{' '}
          <Link to={`${projectPath(project.id)}/explore`}>
            Explore all activities ↗
          </Link>
        </p>
      )}
    </section>
  )
}
export function ExplorePage() {
  const project = useProject()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const words = query.trim().toLocaleLowerCase().split(/\s+/)
  const matches = project.features.filter((f) =>
    words.every((word) =>
      `${f.title} ${f.purpose} ${f.actor} ${f.group ?? ''} ${f.cases.map((c) => c.label).join(' ')}`
        .toLocaleLowerCase()
        .includes(word),
    ),
  )
  const groups = new Map<string, Feature[]>()
  for (const feature of matches) {
    const group =
      feature.group ?? (isBookingFeature(feature) ? 'Bookings' : 'Reviews')
    groups.set(group, [...(groups.get(group) ?? []), feature])
  }
  return (
    <section className="explore-page" aria-labelledby="page-title">
      <FixtureLabel />
      <p className="eyebrow">Follow a question</p>
      <h1 id="page-title">Explore</h1>
      <p className="intro">What would you like to understand?</p>
      <form
        role="search"
        className="search-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="activity-search">Search activities</label>
        <div className="search-row">
          <input
            id="activity-search"
            type="search"
            placeholder="Find an activity or saved case"
            value={query}
            onChange={(e) =>
              setParams(e.target.value ? { q: e.target.value } : {}, {
                replace: true,
              })
            }
          />
          {query && (
            <button
              type="button"
              onClick={() => setParams({}, { replace: true })}
            >
              Clear search
            </button>
          )}
        </div>
      </form>
      {!project.features.length ? (
        <EmptyGuide />
      ) : matches.length === 0 ? (
        <div className="empty-search">
          <h2>No matching activity</h2>
          <p>Try another word or clear your search within this project.</p>
        </div>
      ) : (
        [...groups].map(([group, features]) => (
          <div className="activity-group" key={group}>
            <h2 className="eyebrow">
              {group} / {features.length}{' '}
              {features.length === 1 ? 'activity' : 'activities'}
            </h2>
            {features.map((feature) => (
              <Link
                className="activity-card"
                aria-label={feature.title}
                key={feature.id}
                to={featureLink(project.id, feature, 'explore', query)}
              >
                <FeatureArt feature={feature} />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.purpose}</p>
                  <p className="revision-note">
                    {feature.evidence.status === 'demo'
                      ? 'Illustrative fixture'
                      : feature.evidence.status === 'uncertain'
                        ? 'Uncertain evidence'
                        : 'Source-supported'}
                  </p>
                  <span className="text-link">See the cases ↗</span>
                </div>
              </Link>
            ))}
          </div>
        ))
      )}
    </section>
  )
}
export function MissingPage() {
  const project = useProject()
  const [params] = useSearchParams()
  const query = params.get('q')
  const returnPath = `${projectPath(project.id)}/explore${query ? `?${new URLSearchParams({ q: query })}` : ''}`
  return (
    <section className="missing-page" aria-labelledby="page-title">
      <p className="eyebrow">Atlas / Unavailable</p>
      <h1 id="page-title">This guide is not here yet</h1>
      <p className="intro">
        This link does not point to an available activity or saved case.
      </p>
      <Link
        className="primary-link"
        to={returnPath}
        state={{ restorePosition: true }}
      >
        Return to Explore <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}
