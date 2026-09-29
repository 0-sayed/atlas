import { useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import type { NavigationFeature } from '../../shared/contracts'
import { projectPath, useProject } from '../content/knowledge'
import { NavigationScene } from '../scenes/NavigationScene'
import { AtlasActivityIcon, AtlasIcon } from '../components/AtlasIcon'
import { FeatureEvidence } from '../components/FeatureDetail'
import { AtlasBadge, AtlasPanel } from '../components/AtlasPrimitives'
import { RegisteredArt } from '../components/RegisteredArt'
import { FixtureLabel, MissingPage } from './GuidePages'
import './feature-explanation.css'

const outcomeLabel = {
  available: 'Available',
  unavailable: 'Unavailable',
  unknown: 'Unknown',
} as const

export function NavigationPage({ feature }: { feature: NavigationFeature }) {
  const sceneRef = useRef<HTMLDivElement>(null)
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
      : `${base}/explore${params.get('q') ? `?${new URLSearchParams({ q: params.get('q')! })}` : ''}`
  const relatedParams = new URLSearchParams()
  if (from === 'start' || from === 'explore') relatedParams.set('from', from)
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
        Back to {from === 'start' ? 'Start here' : 'Explore'}
      </Link>
      <FixtureLabel feature={feature} />

      <header className="navigation-hero">
        <div className="navigation-title-icon">
          <AtlasActivityIcon feature={feature} />
        </div>
        <div className="navigation-hero-copy">
          <p className="eyebrow">
            {feature.group ?? 'Activity'} / Feature explanation
          </p>
          <h1 id="page-title">{feature.title}</h1>
          <p className="navigation-purpose">{feature.purpose}</p>
        </div>
        <div className="navigation-hero-scenery" aria-hidden="true">
          <img src="/art/penpot/island.png" alt="" />
          <AtlasActivityIcon feature={feature} />
        </div>
      </header>
      <nav className="navigation-sections" aria-label="Feature sections">
        {[
          ['how-heading', 'Overview'],
          ['rules-heading', 'Rules'],
          ['related-heading', 'Relationships'],
          ['cases-heading', 'Cases & evidence'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => document.getElementById(id)?.focus()}
          >
            {label}
          </button>
        ))}
      </nav>
      <dl className="navigation-meta">
        <div>
          <dt>
            <AtlasIcon name="people" />
            <span>Actor</span>
          </dt>
          <dd>{feature.actor}</dd>
        </div>
        <div>
          <dt>
            <AtlasIcon name="book" />
            <span>Evidence</span>
          </dt>
          <dd>
            {feature.evidence.status === 'demo'
              ? 'Illustrative fixture'
              : feature.evidence.status === 'uncertain'
                ? 'Uncertain evidence'
                : 'Source-supported'}
          </dd>
        </div>
        <div>
          <dt>
            <AtlasIcon name="clock" />
            <span>Revision</span>
          </dt>
          <dd>{feature.revisionLabel}</dd>
        </div>
      </dl>

      <div className="navigation-content-grid">
        <div className="navigation-how-anchor" ref={sceneRef}>
          <AtlasPanel
            id="how-heading"
            title="How it works"
            description="Starting point, action, and recorded result."
            icon={<AtlasIcon name="spark" />}
            tone="info"
            className="navigation-how"
          >
            <p className="navigation-selected-label">Selected saved case</p>
            {example ? (
              <NavigationScene example={example} />
            ) : (
              <div className="navigation-empty">
                <h3>No saved cases</h3>
                <p>No saved cases have been incorporated for this activity.</p>
              </div>
            )}
          </AtlasPanel>
        </div>

        <AtlasPanel
          id="rules-heading"
          title="Business rules"
          icon={<AtlasIcon name="rule" />}
          tone="success"
          className="navigation-rules"
        >
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
        </AtlasPanel>

        <AtlasPanel
          id="cases-heading"
          title="Saved examples and edge cases"
          icon={<AtlasIcon name="warning" />}
          tone="warning"
          className="navigation-cases"
        >
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
                    <AtlasBadge tone={item.outcome}>
                      {outcomeLabel[item.outcome]}
                    </AtlasBadge>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="navigation-empty">No saved examples are available.</p>
          )}
        </AtlasPanel>

        <AtlasPanel
          id="related-heading"
          title="Related features"
          icon={<AtlasIcon name="link" />}
          tone="related"
          className="navigation-related"
        >
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
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="navigation-empty">
              No related features have been recorded.
            </p>
          )}
        </AtlasPanel>
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
    </section>
  )
}
