import type { ApprovalCase, ApprovalFeature } from './contracts.js'

export function approvalOutcome(
  feature: ApprovalFeature,
  example: ApprovalCase,
) {
  if (example.state === 'closed')
    return {
      outcome: 'blocked' as const,
      result: 'Request is closed',
      reason: 'Only a pending request can be approved.',
    }
  if (example.role !== 'reviewer')
    return {
      outcome: 'blocked' as const,
      result: 'A reviewer is needed',
      reason:
        'Requesters cannot approve their own request. An independent reviewer must decide.',
    }
  if (example.approvals === null)
    return {
      outcome: 'unknown' as const,
      result: 'Outcome not established',
      reason:
        'The recorded case does not establish how many independent approvals exist.',
    }
  if (example.approvals < feature.requiredApprovals)
    return {
      outcome: 'blocked' as const,
      result: 'More reviews needed',
      reason: `${example.approvals} of ${feature.requiredApprovals} required independent approvals are recorded. The request stays pending.`,
    }
  return {
    outcome: 'allowed' as const,
    result: 'Ready for approval',
    reason: `The pending request has at least ${feature.requiredApprovals} independent approvals and a reviewer may approve it.`,
  }
}
