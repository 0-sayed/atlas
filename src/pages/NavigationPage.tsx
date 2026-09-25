import { Link, useLocation, useSearchParams } from 'react-router'
import type { NavigationFeature } from '../../shared/contracts'
import { projectPath, useProject } from '../content/knowledge'
import { NavigationScene } from '../scenes/NavigationScene'
import { FeatureEvidence } from '../components/FeatureDetail'
import { RegisteredArt } from '../components/RegisteredArt'
import { FixtureLabel, MissingPage } from './GuidePages'

export function NavigationPage({ feature }: { feature: NavigationFeature }) {
  const project = useProject()
  const base = projectPath(project.id)
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const selected = params.get('case') ?? feature.cases[0]?.id
  const example = feature.cases.find((c) => c.id === selected)
  if (!example && selected !== undefined) return <MissingPage />
  const from = params.get('from')
  const returnPath =
    from === 'start'
      ? base
      : from === 'changes'
        ? `${base}/changes`
        : `${base}/explore${params.get('q') ? `?${new URLSearchParams({ q: params.get('q')! })}` : ''}`
  return (
    <section className="booking-page" aria-labelledby="page-title">
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
      <div className="feature-heading">
        <div>
          <p className="eyebrow">
            {feature.group ?? 'Navigation'} / {feature.actor}
          </p>
          <h1 id="page-title">{feature.title}</h1>
          <p className="intro">{feature.purpose}</p>
        </div>
      </div>
      <ul className="restrictions" aria-label="Recorded rules">
        {feature.rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
      {example ? (
        <>
          <div className="case-picker" role="group" aria-label="Saved cases">
            <span>Try a saved case</span>
            <div>
              {feature.cases.map((c) => (
                <button
                  key={c.id}
                  aria-pressed={example.id === c.id}
                  onClick={() => {
                    const next = new URLSearchParams(params)
                    next.set('case', c.id)
                    setParams(next, { state: location.state })
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <p className="eyebrow">Authored example</p>
          <NavigationScene example={example} />
        </>
      ) : (
        <div className="empty-search">
          <h2>No saved cases</h2>
          <p>No navigation example has been incorporated for this activity.</p>
        </div>
      )}
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
