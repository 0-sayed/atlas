import type { ReactNode } from 'react'
import { approvalOutcome } from '../../shared/approval'
import type { ApprovalCase, ApprovalFeature } from '../../shared/contracts'
import { AtlasIcon } from '../components/AtlasIcon'
import { RecordedCaseOutcome } from '../components/RecordedCaseLayout'

export function ApprovalArt() {
  return (
    <span className="approval-art" aria-hidden="true">
      <AtlasIcon name="book" />
    </span>
  )
}
export function ApprovalScene({
  feature,
  example,
  evidence,
}: {
  feature: ApprovalFeature
  example: ApprovalCase
  evidence: ReactNode
}) {
  const outcome = approvalOutcome(feature, example)
  const stateLabel =
    example.state === 'pending' ? 'Pending request' : 'Closed request'
  const roleLabel =
    example.role === 'reviewer'
      ? 'Acting as an independent reviewer'
      : 'Acting as the requester'
  return (
    <RecordedCaseOutcome
      outcome={outcome.outcome}
      result={outcome.result}
      condition={outcome.reason}
      facts={
        <dl
          className="recorded-case-facts"
          aria-label="Recorded case conditions"
        >
          <div>
            <dt>Request state</dt>
            <dd>{stateLabel}</dd>
          </div>
          <div>
            <dt>Actor</dt>
            <dd>{roleLabel}</dd>
          </div>
          <div>
            <dt>Recorded approvals</dt>
            <dd>
              {example.approvals ?? '?'} recorded / {feature.requiredApprovals}{' '}
              required
            </dd>
          </div>
        </dl>
      }
      evidence={evidence}
    />
  )
}
