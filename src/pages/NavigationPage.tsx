import { useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import type { NavigationFeature } from '../../shared/contracts'
import { projectPath, useProject } from '../content/knowledge'
import { NavigationScene } from '../scenes/NavigationScene'
import { ActivitySubject } from '../scenes/ActivityArt'
import { FeatureEvidence } from '../components/FeatureDetail'
import { RegisteredArt } from '../components/RegisteredArt'
import { FixtureLabel, MissingPage } from './GuidePages'
import './feature-explanation.css'

const outcomeLabel = {
  available: 'Available',
  unavailable: 'Unavailable',
  unknown: 'Unknown',
} as const

export function NavigationPage({ feature }: { feature: NavigationFeature }) {
  const sceneRef = useRef<HTMLElement>(null)
  const project = useProject()
  const base = projectPath(project.id)
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const selected = params.get('case') ?? feature.cases[0]?.id
  const example = feature.cases.find((item) => item.id === selected)
  if (!example && selected !== undefined) return <MissingPage />

  const from = params.get('from')
  const returnPath =
    from === 'start'
      ? base
      : from === 'changes'
        ? `${base}/changes`
        : `${base}/explore${params.get('q') ? `?${new URLSearchParams({ q: params.get('q')! })}` : ''}`
  const relatedParams = new URLSearchParams()
  if (from) relatedParams.set('from', from)
  const query = params.get('q')
  if (query) relatedParams.set('q', query)
  const related = project.relations.flatMap((relation) => {
    if (relation.from !== feature.id && relation.to !== feature.id) return []
    const outgoing = relation.from === feature.id
    const other = project.features.find(
      (item) => item.id === (outgoing ? relation.to : relation.from),
    )
    if (!other) return []
    return [
      {
        id: relation.id,
        feature: other,
        label:
          relation.kind === 'related'
            ? 'Related to'
            : outgoing
              ? 'Requires'
              : 'Required by',
      },
    ]
  })

  return (
    <section
      className="booking-page navigation-page"
      aria-labelledby="page-title"
    >
      <Link
        className="back-link"
        to={returnPath}
        state={{ restorePosition: true }}
      >
        <span aria-hidden="true">← </span>Back to{' '}
        {from === 'start'
          ? 'Start here'
          : from === 'changes'
            ? 'What changed'
            : 'Explore'}
      </Link>
      <FixtureLabel feature={feature} />

      <header className="navigation-hero">
        <div className="navigation-hero-copy">
          <p className="eyebrow">
            {feature.group ?? 'Activity'} / Feature explanation
          </p>
          <h1 id="page-title">{feature.title}</h1>
          <dl className="navigation-meta">
            <div>
              <dt>Actor</dt>
              <dd>{feature.actor}</dd>
            </div>
            <div>
              <dt>Goal</dt>
              <dd>{feature.purpose}</dd>
            </div>
          </dl>
        </div>
        <div className="navigation-hero-art">
          <img
            className="navigation-terrain"
            src="/art/atlas-island.png"
            alt=""
          />
          <ActivitySubject feature={feature} />
        </div>
      </header>

      <div className="navigation-content-grid">
        <section
          className="navigation-panel navigation-how"
          ref={sceneRef}
          aria-labelledby="how-heading"
        >
          <div className="navigation-panel-heading">
            <span className="navigation-panel-icon" aria-hidden="true">
              ✦
            </span>
            <div>
              <p className="eyebrow">Selected saved case</p>
              <h2 id="how-heading">How it works</h2>
              <p>Starting point, action, and recorded result.</p>
            </div>
          </div>
          {example ? (
            <NavigationScene example={example} />
          ) : (
            <div className="navigation-empty">
              <h3>No saved cases</h3>
              <p>No saved cases have been incorporated for this activity.</p>
            </div>
          )}
        </section>

        <section
          className="navigation-panel navigation-rules"
          aria-labelledby="rules-heading"
        >
          <div className="navigation-panel-heading">
            <span className="navigation-panel-icon" aria-hidden="true">
              ≡
            </span>
            <div>
              <p className="eyebrow">Recorded constraints</p>
              <h2 id="rules-heading">Business rules</h2>
            </div>
          </div>
          {feature.rules.length > 0 ? (
            <ol className="navigation-rule-list">
              {feature.rules.map((rule, index) => (
                <li key={index}>
                  <span aria-hidden="true">{index + 1}</span>
                  <p>{rule}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="navigation-empty">
              No business rules have been recorded.
            </p>
          )}
        </section>

        <section
          className="navigation-panel navigation-cases"
          aria-labelledby="cases-heading"
        >
          <div className="navigation-panel-heading">
            <span className="navigation-panel-icon" aria-hidden="true">
              ◇
            </span>
            <div>
              <p className="eyebrow">Compare recorded outcomes</p>
              <h2 id="cases-heading">Saved examples and edge cases</h2>
            </div>
          </div>
          {feature.cases.length > 0 ? (
            <div className="case-picker" role="group" aria-label="Saved cases">
              <div className="navigation-case-grid">
                {feature.cases.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.label}
                    aria-pressed={example?.id === item.id}
                    onClick={() => {
                      const next = new URLSearchParams(params)
                      next.set('case', item.id)
                      setParams(next, { state: location.state })
                      sceneRef.current?.scrollIntoView({
                        block: 'start',
                        behavior: 'instant',
                      })
                    }}
                  >
                    <span className="navigation-case-title">{item.label}</span>
                    <span
                      className={`navigation-case-outcome outcome-${item.outcome}`}
                    >
                      {outcomeLabel[item.outcome]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="navigation-empty">No saved examples are available.</p>
          )}
        </section>

        <section
          className="navigation-panel navigation-related"
          aria-labelledby="related-heading"
        >
          <div className="navigation-panel-heading">
            <span className="navigation-panel-icon" aria-hidden="true">
              ↗
            </span>
            <div>
              <p className="eyebrow">Saved relationships</p>
              <h2 id="related-heading">Related features</h2>
            </div>
          </div>
          {related.length > 0 ? (
            <ul className="navigation-related-list">
              {related.map((relation) => (
                <li key={relation.id}>
                  <Link
                    to={`${base}/explore/${relation.feature.id}${relatedParams.size ? `?${relatedParams}` : ''}`}
                  >
                    <span>
                      <small>{relation.label}</small>
                      <strong>{relation.feature.title}</strong>
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="navigation-empty">
              No related features have been recorded.
            </p>
          )}
        </section>
      </div>

      {feature.assetIds.map((id) => (
        <RegisteredArt
          key={id}
          projectId={project.id}
          assetId={id}
          title={feature.title}
        />
      ))}
      <details className="detail-panel navigation-evidence">
        <summary>Source and evidence</summary>
        <FeatureEvidence feature={feature} />
      </details>
      <div className="scene-actions">
        <Link to={`${base}/changes`}>See what changed ↗</Link>
      </div>
    </section>
  )
}
