import { approvalOutcome } from '../../shared/approval'
import type { ApprovalCase, ApprovalFeature } from '../../shared/contracts'

export function ApprovalArt() {
  return (
    <svg viewBox="0 0 280 200" aria-hidden="true" className="approval-art">
      <ellipse cx="140" cy="174" rx="104" ry="13" fill="#ded8ed" />
      <rect
        x="63"
        y="25"
        width="137"
        height="144"
        rx="14"
        fill="#fffaf1"
        stroke="#53496a"
        strokeWidth="3"
        transform="rotate(-7 140 100)"
      />
      <path
        d="M88 58h74M88 78h55M88 98h68"
        stroke="#b4a8ca"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle
        cx="179"
        cy="132"
        r="38"
        fill="#cef0dc"
        stroke="#39755c"
        strokeWidth="3"
      />
      <path
        d="m160 131 13 13 25-28"
        stroke="#39755c"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="m222 39 4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#df9854" />
    </svg>
  )
}
export function ApprovalScene({
  feature,
  example,
}: {
  feature: ApprovalFeature
  example: ApprovalCase
}) {
  const outcome = approvalOutcome(feature, example)
  return (
    <div className={`approval-scene outcome-${outcome.outcome}`}>
      <div className="review-desk">
        <ApprovalArt />
        <div>
          <p className="eyebrow">The review desk</p>
          <h2>
            {example.state === 'pending'
              ? 'A draft is waiting'
              : 'This request is closed'}
          </h2>
          <p>
            Acting as{' '}
            {example.role === 'reviewer'
              ? 'an independent reviewer'
              : 'the requester'}
          </p>
        </div>
      </div>
      <div className="approval-stamps" aria-label="Recorded approvals">
        <p>
          <strong>{example.approvals ?? '?'}</strong> recorded /{' '}
          <strong>{feature.requiredApprovals}</strong> required
        </p>
        <div aria-hidden="true">
          {Array.from({ length: feature.requiredApprovals }, (_, i) => (
            <span
              key={i}
              className={
                example.approvals === null
                  ? 'stamp unknown'
                  : i < example.approvals
                    ? 'stamp filled'
                    : 'stamp'
              }
            >
              {example.approvals === null
                ? '?'
                : i < example.approvals
                  ? '✓'
                  : '○'}
            </span>
          ))}
        </div>
      </div>
      <div className="outcome-banner" role="status" aria-live="polite">
        <p className="eyebrow">
          {outcome.outcome === 'allowed'
            ? 'Allowed'
            : outcome.outcome === 'blocked'
              ? 'Blocked'
              : 'Unknown'}
        </p>
        <h2>{outcome.result}</h2>
        <p>{outcome.reason}</p>
      </div>
    </div>
  )
}
