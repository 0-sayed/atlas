import { useId, type ReactNode } from 'react'
import type { Feature } from '../../shared/contracts'
import { AtlasIcon } from './AtlasIcon'

export type RecordedOutcome = 'allowed' | 'blocked' | 'unknown'

export type RecordedCaseChoice = {
  id: string
  label: string
  outcome: RecordedOutcome
}

function outcomeIcon(outcome: RecordedOutcome) {
  return outcome === 'allowed'
    ? 'check'
    : outcome === 'blocked'
      ? 'warning'
      : 'warning'
}

function outcomeText(outcome: RecordedOutcome) {
  return outcome === 'allowed'
    ? 'Allowed'
    : outcome === 'blocked'
      ? 'Unavailable'
      : 'Not established'
}

export function RecordedCaseLayout({
  cases,
  selectedId,
  onSelect,
  children,
}: {
  cases: RecordedCaseChoice[]
  selectedId: string
  onSelect: (id: string) => void
  children: ReactNode
}) {
  const statusId = useId()
  return (
    <div className="recorded-case-grid">
      <section
        className="recorded-case-picker case-picker"
        aria-label="Saved cases"
      >
        <h2>
          <AtlasIcon name="compass" /> Choose a recorded case
        </h2>
        <div
          className="recorded-case-options"
          role="group"
          aria-label="Saved cases"
        >
          {cases.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-describedby={`${statusId}-${item.id}`}
              aria-pressed={item.id === selectedId}
              onClick={() => onSelect(item.id)}
            >
              <AtlasIcon name={outcomeIcon(item.outcome)} />
              <span>
                <strong>{item.label}</strong>
                <small id={`${statusId}-${item.id}`}>
                  {item.id === selectedId ? 'Selected · ' : ''}
                  {outcomeText(item.outcome)}
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>
      {children}
    </div>
  )
}

export function RecordedCaseOutcome({
  outcome,
  result,
  consequence,
  condition,
  facts,
  evidence,
}: {
  outcome: RecordedOutcome
  result: string
  consequence?: string
  condition: ReactNode
  facts?: ReactNode
  evidence: ReactNode
}) {
  return (
    <section
      className="recorded-case-outcome"
      data-outcome={outcome}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Selected outcome"
    >
      <h2 className="recorded-outcome-title">
        <AtlasIcon name={outcomeIcon(outcome)} /> Selected outcome
      </h2>
      <div className="recorded-outcome-result">
        <h3>{result}</h3>
        {consequence && <p>{consequence}</p>}
      </div>
      <div className="recorded-condition">
        <span className="recorded-condition-label">Essential condition</span>
        <p>{condition}</p>
        {facts}
      </div>
      <div className="recorded-evidence">
        <h3>
          <AtlasIcon name="book" /> Evidence and scope
        </h3>
        {evidence}
      </div>
    </section>
  )
}

export function RecordedCaseEvidence({
  feature,
}: {
  feature: Pick<Feature, 'evidence' | 'revisionLabel'>
}) {
  const status =
    feature.evidence.status === 'demo'
      ? 'Illustrative fixture'
      : feature.evidence.status === 'uncertain'
        ? 'Uncertain evidence'
        : 'Reviewed evidence'
  return (
    <>
      <p>
        {status} · {feature.evidence.source} · {feature.revisionLabel}
      </p>
      <p>Scope: {feature.evidence.scope}</p>
    </>
  )
}
