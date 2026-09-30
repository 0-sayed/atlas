import { featureReturn } from '../content/destinations'
import { useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import type { AuthoredFeature } from '../../shared/contracts'
import { authoredOutcomeLabels, authoredView } from '../../shared/authored'
import { useProject } from '../content/knowledge'
import { AtlasActivityIcon, AtlasIcon } from '../components/AtlasIcon'
import { AtlasBadge, AtlasPanel } from '../components/AtlasPrimitives'
import { ClaimEvidence } from '../components/ClaimEvidence'
import { FeatureEvidence } from '../components/FeatureDetail'
import { RegisteredArt } from '../components/RegisteredArt'
import { AuthoredScene } from '../scenes/AuthoredScene'
import { FixtureLabel, MissingPage } from './GuidePages'
import './feature-explanation.css'
import './authored-activity.css'

export function AuthoredPage({ feature }: { feature: AuthoredFeature }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const project = useProject()
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const view = authoredView(
    project,
    feature,
    params.get('case') ?? feature.cases[0]?.id,
  )
  if (params.has('case') && !view.selected) return <MissingPage />
  const back = featureReturn(project.id, params)
  return (
    <section
      className="booking-page navigation-page authored-page"
      aria-labelledby="page-title"
    >
      <Link
        className="back-link"
        state={{ restorePosition: true }}
        to={back.to}
      >
        Back to {back.label}
      </Link>
      <FixtureLabel feature={feature} />
      <header className="navigation-hero">
        <div className="navigation-title-icon">
          <AtlasActivityIcon feature={feature} />
        </div>
        <div className="navigation-hero-copy">
          <p className="eyebrow">
            {project.areas.find((a) => a.id === feature.areaId)?.title ??
              feature.group ??
              'Activity'}{' '}
            / Feature explanation
          </p>
          <h1 id="page-title">{feature.title}</h1>
          <p className="navigation-purpose">{feature.purpose}</p>
          <ClaimEvidence ids={feature.evidenceIds} />
        </div>
        <div className="navigation-hero-scenery" aria-hidden="true">
          <img src="/art/penpot/island.png" alt="" />
          <AtlasActivityIcon feature={feature} />
        </div>
      </header>
      <nav className="navigation-sections" aria-label="Feature sections">
        {[
          ['how-heading', 'Overview'],
          ['rules-heading', 'Conditions'],
          ['actors-heading', 'Participants'],
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
      <div className="navigation-content-grid">
        <AtlasPanel
          id="how-heading"
          title="How it works"
          description="Recorded steps and consequences; select a saved case to inspect them."
          icon={<AtlasIcon name="spark" />}
          tone="info"
          className="navigation-how"
        >
          <div className="navigation-how-anchor" ref={sceneRef}>
            <AuthoredScene view={view} />
          </div>
        </AtlasPanel>
        <AtlasPanel
          id="rules-heading"
          title="Recorded conditions"
          icon={<AtlasIcon name="rule" />}
          tone="success"
          className="navigation-rules"
        >
          {view.rules.length ? (
            <ul className="authored-rule-list">
              {view.rules.map((rule) => (
                <li key={rule.id}>
                  <h3>{rule.title}</h3>
                  <p>{rule.statement}</p>
                  <ClaimEvidence ids={rule.evidenceIds} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No conditions have been recorded.</p>
          )}
        </AtlasPanel>
        <AtlasPanel
          id="cases-heading"
          title="Saved cases"
          icon={<AtlasIcon name="warning" />}
          tone="warning"
          className="navigation-cases"
        >
          {feature.cases.length ? (
            <div className="case-picker" role="group" aria-label="Saved cases">
              <div className="navigation-case-grid">
                {feature.cases.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    aria-label={c.label}
                    aria-pressed={view.selected?.id === c.id}
                    onClick={() => {
                      const next = new URLSearchParams(params)
                      next.set('case', c.id)
                      setParams(next, { state: location.state })
                      sceneRef.current?.scrollIntoView({
                        block: 'start',
                        behavior: 'instant',
                      })
                    }}
                  >
                    <span className="navigation-case-title">{c.label}</span>
                    <AtlasBadge
                      tone={
                        c.outcome.status === 'allowed'
                          ? 'available'
                          : c.outcome.status === 'blocked'
                            ? 'unavailable'
                            : 'unknown'
                      }
                    >
                      {authoredOutcomeLabels[c.outcome.status]}
                    </AtlasBadge>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>No saved examples are available.</p>
          )}
        </AtlasPanel>
        <AtlasPanel
          id="actors-heading"
          title="Participating actors"
          icon={<AtlasIcon name="people" />}
          tone="related"
          className="navigation-related"
        >
          {view.actors.length ? (
            <ul className="authored-actors">
              {view.actors.map((actor) => (
                <li key={actor.id}>
                  <h3>{actor.name}</h3>
                  {actor.description && <p>{actor.description}</p>}
                  <ClaimEvidence ids={actor.evidenceIds} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No participating actors have been recorded.</p>
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
