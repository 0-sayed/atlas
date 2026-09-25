import type { ApprovalFeature, CreateRequest } from '../shared/contracts.js'

export const approvalFeature: ApprovalFeature = {
  id: 'approval',
  title: 'Approve a publishing request',
  actor: 'Reviewer',
  purpose: 'Review a draft before it can be published.',
  group: 'Publishing',
  essentialOrder: 0,
  scene: { kind: 'approval', version: 1 },
  requiredApprovals: 1,
  revisionLabel: 'Approval fixture v1',
  evidence: {
    status: 'demo',
    source: 'Atlas authored approval fixture',
    sourceRevision: 'approval-fixture-v1',
    scope: 'Illustrative publishing review only',
    description:
      'Invented prototype rules. No source application, PR or deployed behavior has been verified.',
  },
  assetIds: [],
  cases: [
    {
      id: 'at-limit',
      label: 'One approval',
      role: 'reviewer',
      state: 'pending',
      approvals: 1,
    },
    {
      id: 'two-reviews',
      label: 'Two approvals',
      role: 'reviewer',
      state: 'pending',
      approvals: 2,
    },
    {
      id: 'requester',
      label: 'Own request',
      role: 'requester',
      state: 'pending',
      approvals: 2,
    },
    {
      id: 'closed',
      label: 'Already closed',
      role: 'reviewer',
      state: 'closed',
      approvals: 2,
    },
    {
      id: 'unknown',
      label: 'Reviews unknown',
      role: 'reviewer',
      state: 'pending',
      approvals: null,
    },
  ],
}
export const approvalSeed: CreateRequest = {
  contractVersion: 1,
  id: 'approval-demo',
  title: 'Illustrative publishing guide',
  features: [approvalFeature],
  relations: [],
}
