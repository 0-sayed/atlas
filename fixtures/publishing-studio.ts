import type {
  ApprovalFeature,
  CreateRequest,
  NavigationFeature,
  UpdateRequest,
} from '../shared/contracts.js'

// Entirely fictional editorial scenarios for an Atlas showcase.
const evidence = {
  status: 'demo' as const,
  source: 'Atlas authored Publishing Studio fixture',
  sourceRevision: 'publishing-studio-fixture-v1',
  scope: 'Fictional Field Notes editorial journey; saved scenarios only',
  description:
    'Invented examples for a fictional publication. These saved scenarios do not execute editing, review, publishing, or search in a source product.',
}

const prepareArticle: NavigationFeature = {
  id: 'prepare-article',
  title: 'Prepare the Field Notes article',
  actor: 'Writer',
  purpose:
    'Gather the story, summary, image credit, and image permission before requesting review.',
  group: 'Field Notes · Editorial',
  essentialOrder: 0,
  scene: { kind: 'navigation', version: 1 },
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  assetIds: [],
  presentation: { illustration: 'document', accent: 'sky' },
  rules: [
    'A complete draft includes the story, summary, and image credit.',
    'Image permission must be confirmed before the draft is ready for review.',
  ],
  cases: [
    {
      id: 'draft-complete',
      label: 'Story and image ready',
      start:
        '“Harbor Walks” has a story, summary, image credit, and confirmed image permission.',
      action: 'Prepare article',
      result: 'Draft ready for review request',
      reason: 'The article and image meet the preparation requirements.',
      outcome: 'available',
    },
    {
      id: 'credit-missing',
      label: 'Image credit missing',
      start: '“Harbor Walks” has a story and summary, but no image credit.',
      action: 'Prepare article',
      result: 'Draft needs an image credit',
      reason: 'The image cannot be reviewed without a credit.',
      outcome: 'unavailable',
    },
    {
      id: 'rights-unchecked',
      label: 'Image rights unclear',
      start:
        'The image credit is recorded, but permission to use the image has not been checked.',
      action: 'Prepare article',
      result: 'Image use not established',
      reason: 'Permission to use the image has not been confirmed.',
      outcome: 'unknown',
    },
  ],
}

const requestReview: NavigationFeature = {
  id: 'request-review',
  title: 'Request editorial review',
  actor: 'Writer',
  purpose: 'Hand the prepared article to an independent reviewer.',
  group: 'Field Notes · Editorial',
  scene: { kind: 'navigation', version: 1 },
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  assetIds: [],
  presentation: { illustration: 'people', accent: 'peach' },
  rules: [
    'The draft must be prepared before review can be requested.',
    'An independent reviewer must be assigned to receive the request.',
  ],
  cases: [
    {
      id: 'review-requested',
      label: 'Prepared draft handed off',
      start:
        '“Harbor Walks” is prepared and an independent reviewer is assigned.',
      action: 'Request review',
      result: 'Review request ready',
      reason: 'The prepared draft has an independent reviewer.',
      outcome: 'available',
    },
    {
      id: 'draft-incomplete',
      label: 'Draft still incomplete',
      start: '“Harbor Walks” still lacks its image credit.',
      action: 'Request review',
      result: 'Review request blocked',
      reason: 'The image credit must be added before handoff.',
      outcome: 'unavailable',
    },
    {
      id: 'reviewer-unassigned',
      label: 'Reviewer assignment unclear',
      start:
        'The draft is prepared, but the reviewer assignment was not recorded.',
      action: 'Request review',
      result: 'Reviewer handoff unclear',
      reason: 'No independent reviewer is confirmed for this request.',
      outcome: 'unknown',
    },
  ],
}

const approveArticle: ApprovalFeature = {
  id: 'approve-article',
  title: 'Approve the article request',
  actor: 'Reviewer',
  purpose:
    'See whether the pending request is ready for an independent reviewer to approve.',
  group: 'Field Notes · Editorial',
  essentialOrder: 1,
  scene: { kind: 'approval', version: 1 },
  requiredApprovals: 1,
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  assetIds: [],
  presentation: { illustration: 'people', accent: 'sage' },
  cases: [
    {
      id: 'one-review',
      label: 'One independent review recorded',
      role: 'reviewer',
      state: 'pending',
      approvals: 1,
    },
    {
      id: 'two-reviews',
      label: 'Two independent reviews recorded',
      role: 'reviewer',
      state: 'pending',
      approvals: 2,
    },
    {
      id: 'own-request',
      label: 'Writer opens own request',
      role: 'requester',
      state: 'pending',
      approvals: 2,
    },
    {
      id: 'closed-request',
      label: 'Request already closed',
      role: 'reviewer',
      state: 'closed',
      approvals: 2,
    },
    {
      id: 'unknown-reviews',
      label: 'Review count unrecorded',
      role: 'reviewer',
      state: 'pending',
      approvals: null,
    },
  ],
}

const publishArticle: NavigationFeature = {
  id: 'publish-article',
  title: 'Publish the Field Notes issue',
  actor: 'Editor',
  purpose: 'Place an approved article in a selected Field Notes issue.',
  group: 'Field Notes · Editorial',
  essentialOrder: 2,
  scene: { kind: 'navigation', version: 1 },
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  assetIds: [],
  presentation: { illustration: 'calendar', accent: 'peach' },
  rules: [
    'The review request must be approved before the article can be published.',
    'The editor must assign an issue for the article.',
  ],
  cases: [
    {
      id: 'issue-ready',
      label: 'Approved article, issue selected',
      start:
        'The review request for “Harbor Walks” is approved, and the September Field Notes issue is assigned.',
      action: 'Publish article',
      result: 'Article ready for publication',
      reason:
        'The request is approved and the article has an issue assignment.',
      outcome: 'available',
    },
    {
      id: 'review-pending',
      label: 'Review still pending',
      start:
        '“Harbor Walks” is assigned to the issue, but its review is still pending.',
      action: 'Publish article',
      result: 'Publication blocked',
      reason: 'The review request has not been approved.',
      outcome: 'unavailable',
    },
    {
      id: 'issue-unconfirmed',
      label: 'Issue assignment unconfirmed',
      start:
        'The review request is approved, but no issue assignment is recorded.',
      action: 'Publish article',
      result: 'Publication destination unclear',
      reason:
        'The editor has not confirmed which issue will carry the article.',
      outcome: 'unknown',
    },
  ],
}

const findPublishedArticle: NavigationFeature = {
  id: 'find-published-article',
  title: 'Find the published article',
  actor: 'Reader',
  purpose: 'Locate “Harbor Walks” in the Field Notes issue.',
  group: 'Field Notes · Reader',
  scene: { kind: 'navigation', version: 1 },
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  assetIds: [],
  presentation: { illustration: 'compass', accent: 'sky' },
  rules: [
    'A published article appears in its assigned issue listing.',
    'An unpublished draft has no public issue listing.',
  ],
  cases: [
    {
      id: 'issue-listing',
      label: 'Article listed in issue',
      start:
        '“Harbor Walks” is published and listed in the September Field Notes issue.',
      action: 'Open article',
      result: 'Article opens from the issue',
      reason: '“Harbor Walks” is published and listed in the September issue.',
      outcome: 'available',
    },
    {
      id: 'still-draft',
      label: 'Article remains a draft',
      start: '“Harbor Walks” has not been published.',
      action: 'Open article',
      result: 'Article unavailable',
      reason: 'The article remains a draft and has no public listing.',
      outcome: 'unavailable',
    },
    {
      id: 'listing-unchecked',
      label: 'Listing not verified',
      start: 'Publication is recorded, but the issue listing was not checked.',
      action: 'Open article',
      result: 'Article link not established',
      reason: 'Its appearance in the issue listing has not been confirmed.',
      outcome: 'unknown',
    },
  ],
}

export const publishingStudioSeed: CreateRequest = {
  contractVersion: 1,
  id: 'publishing-studio',
  title: 'Publishing Studio · Demo',
  features: [
    prepareArticle,
    requestReview,
    approveArticle,
    publishArticle,
    findPublishedArticle,
  ],
  relations: [
    {
      id: 'review-requires-draft',
      from: 'request-review',
      to: 'prepare-article',
      kind: 'requires',
    },
    {
      id: 'approval-requires-request',
      from: 'approve-article',
      to: 'request-review',
      kind: 'requires',
    },
    {
      id: 'publish-requires-approval',
      from: 'publish-article',
      to: 'approve-article',
      kind: 'requires',
    },
    {
      id: 'find-requires-published',
      from: 'find-published-article',
      to: 'publish-article',
      kind: 'requires',
    },
  ],
}

export const publishingStudioReviewUpdate: UpdateRequest = {
  contractVersion: 1,
  expectedRevision: 1,
  upsertFeatures: [
    {
      ...approveArticle,
      requiredApprovals: 2,
      revisionLabel: 'Publishing Studio fixture v2',
      evidence: {
        ...evidence,
        sourceRevision: 'publishing-studio-fixture-v2',
        description:
          'Invented revision: the fictional review request now requires two independent approvals. No source product behavior was inspected.',
      },
    },
  ],
}
