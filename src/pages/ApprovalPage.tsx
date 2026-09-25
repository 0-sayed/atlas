import { useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import type { ApprovalFeature } from '../../shared/contracts'
import { useProject, projectPath } from '../content/knowledge'
import { ApprovalScene } from '../scenes/ApprovalScene'
import { FeatureEvidence } from '../components/FeatureDetail'
import { RegisteredArt } from '../components/RegisteredArt'
import { FixtureLabel, MissingPage } from './GuidePages'

export function ApprovalPage({ feature }: { feature: ApprovalFeature }) {
  const project = useProject()
  const base = projectPath(project.id)
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const [detailOpen, setDetailOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const selected = params.get('case') ?? feature.cases[0]?.id
  const example = feature.cases.find((c) => c.id === selected)
  if (!example && (selected !== undefined || feature.cases.length > 0))
    return <MissingPage />
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
            {feature.group ?? 'Reviews'} / {feature.actor}
          </p>
          <h1 id="page-title">{feature.title}</h1>
          <p className="intro">{feature.purpose}</p>
        </div>
      </div>
      <ul className="restrictions" aria-label="Essential restrictions">
        <li>Pending request</li>
        <li>Independent reviewer</li>
        <li>At least {feature.requiredApprovals} independent approvals</li>
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
          {feature.assetIds.map((id) => (
            <RegisteredArt
              key={id}
              projectId={project.id}
              assetId={id}
              title={feature.title}
            />
          ))}
          <ApprovalScene feature={feature} example={example} />
        </>
      ) : (
        <div className="empty-search">
          <h2>No saved cases</h2>
          <p>
            The recorded rule is available, but no example outcome has been
            incorporated.
          </p>
        </div>
      )}
      <div className="scene-actions">
        <button
          className="reason-trigger"
          ref={trigger}
          aria-expanded={detailOpen}
          aria-controls="approval-detail"
          onClick={() => setDetailOpen(!detailOpen)}
        >
          {example ? 'Why this outcome?' : 'More detail'}{' '}
          {detailOpen ? '−' : '+'}
        </button>
        <Link to={`${base}/changes`}>See what changed ↗</Link>
      </div>
      {detailOpen && (
        <aside
          id="approval-detail"
          className="detail-panel"
          aria-label="More detail"
        >
          <div>
            <FeatureEvidence feature={feature} />
          </div>
          <button
            onClick={() => {
              setDetailOpen(false)
              trigger.current?.focus()
            }}
          >
            Close detail
          </button>
        </aside>
      )}
    </section>
  )
}
