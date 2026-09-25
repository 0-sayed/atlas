import { bookingView } from '../../shared/booking'
import { approvalOutcome } from '../../shared/approval'
import { isBookingFeature, type Feature } from '../../shared/contracts'

export function HistoricalFeature({
  feature,
  label,
}: {
  feature: Feature
  label: string
}) {
  const view = isBookingFeature(feature) ? bookingView(feature) : null
  const cases = view
    ? view.bookingCases.map((c) => ({
        id: c.id,
        label: c.label,
        result: c.result,
        reason: c.reason,
        conditions: `${c.hours} hours remaining · ${c.owner === 'you' ? 'Owned by you' : 'Owned by someone else'} · ${c.confirmed ? 'Confirmed' : 'Not confirmed'} · Slot ${c.slot}`,
      }))
    : !isBookingFeature(feature)
      ? feature.cases.map((c) => ({
          ...c,
          ...approvalOutcome(feature, c),
          conditions: `${c.role === 'reviewer' ? 'Independent reviewer' : 'Requester'} · Request ${c.state} · ${c.approvals ?? 'Unknown'} approvals`,
        }))
      : []
  const restrictions =
    view?.bookingRestrictions ??
    (!isBookingFeature(feature)
      ? [
          'Pending request',
          'Independent reviewer',
          `At least ${feature.requiredApprovals} independent approvals`,
        ]
      : [])
  return (
    <div className="historical-feature">
      <p className="eyebrow">{label} · Historical</p>
      <p>
        <strong>{feature.title}</strong>
      </p>
      <p>{feature.purpose}</p>
      <p>Actor: {feature.actor}</p>
      <details>
        <summary>Recorded rules, cases and evidence</summary>
        <ul>
          {restrictions.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        {cases.length === 0 && <p>No saved cases in this snapshot.</p>}
        <dl>
          {cases.map((c) => (
            <div className="historical-case" key={c.id}>
              <dt>
                <strong>{c.label}</strong>
              </dt>
              <dd>
                <p>{c.conditions}</p>
                <p className="historical-outcome">{c.result}</p>
                <p>{c.reason}</p>
              </dd>
            </div>
          ))}
        </dl>
        <p className="revision-note">
          {feature.evidence.status === 'demo'
            ? 'Illustrative fixture'
            : feature.evidence.status === 'uncertain'
              ? 'Uncertain evidence'
              : 'Source-supported'}{' '}
          · {feature.revisionLabel}
        </p>
        <dl className="evidence-fields">
          <dt>Source</dt>
          <dd>{feature.evidence.source}</dd>
          <dt>Inspected revision</dt>
          <dd>{feature.evidence.sourceRevision}</dd>
          <dt>Scope</dt>
          <dd>{feature.evidence.scope}</dd>
        </dl>
        <p>{feature.evidence.description}</p>
      </details>
    </div>
  )
}
