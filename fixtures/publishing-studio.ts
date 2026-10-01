import type {
  ApprovalFeature,
  AuthoredFeature,
  CreateRequest,
  Feature,
  NavigationFeature,
} from '../shared/contracts.js'

type KnowledgeBindings = Pick<
  Feature,
  'actorIds' | 'ruleIds' | 'areaId' | 'evidenceIds'
>

// Entirely fictional editorial scenarios for an Atlas showcase.
const evidence = {
  status: 'demo' as const,
  source: 'Atlas authored Publishing Studio fixture',
  sourceRevision: 'publishing-studio-fixture-v1',
  scope: 'Fictional Field Notes editorial journey; saved scenarios only',
  description:
    'Invented examples for a fictional publication. These saved scenarios do not execute editing, review, publishing, or search in a source product.',
}

const prepareArticle: NavigationFeature & KnowledgeBindings = {
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
  actorIds: ['writer'],
  ruleIds: ['draft-prepared', 'image-permission'],
  areaId: 'editorial',
  evidenceIds: ['editorial-example'],
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

const requestReview: AuthoredFeature = {
  id: 'request-review',
  title: 'Request editorial review',
  actor: 'Writer and Reviewer',
  purpose: 'Hand the prepared article to an independent reviewer.',
  group: 'Field Notes · Editorial',
  scene: { kind: 'authored', version: 1 },
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  evidenceIds: ['editorial-example'],
  actorIds: ['writer', 'reviewer'],
  ruleIds: ['draft-prepared', 'reviewer-independent'],
  areaId: 'editorial',
  assetIds: [],
  presentation: { illustration: 'people', accent: 'peach' },
  steps: [
    {
      id: 'check-draft',
      title: 'Check the prepared draft',
      description:
        'The writer confirms the story, summary, image credit, and image permission.',
      actorIds: ['writer'],
      ruleIds: ['draft-prepared'],
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'assign-reviewer',
      title: 'Assign an independent reviewer',
      description:
        'A reviewer other than the writer receives the review request.',
      actorIds: ['reviewer'],
      ruleIds: ['reviewer-independent'],
      evidenceIds: ['editorial-example'],
    },
  ],
  cases: [
    {
      id: 'review-requested',
      label: 'Prepared draft handed off',
      stepIds: ['check-draft', 'assign-reviewer'],
      evidenceIds: ['editorial-example'],
      conditions: [
        { ruleId: 'draft-prepared', state: 'met' },
        { ruleId: 'reviewer-independent', state: 'met' },
      ],
      outcome: {
        status: 'allowed',
        result: 'Review request ready',
        reason: 'The prepared draft has an independent reviewer.',
      },
    },
    {
      id: 'draft-incomplete',
      label: 'Draft still incomplete',
      stepIds: ['check-draft'],
      evidenceIds: ['editorial-example'],
      conditions: [
        { ruleId: 'draft-prepared', state: 'not-met' },
        { ruleId: 'reviewer-independent', state: 'met' },
      ],
      outcome: {
        status: 'blocked',
        result: 'Review request blocked',
        reason: 'The image credit must be added before handoff.',
      },
    },
    {
      id: 'reviewer-unassigned',
      label: 'Reviewer assignment unclear',
      stepIds: ['check-draft'],
      evidenceIds: ['reviewer-unverified'],
      conditions: [
        { ruleId: 'draft-prepared', state: 'met' },
        { ruleId: 'reviewer-independent', state: 'unknown' },
      ],
      outcome: {
        status: 'unknown',
        result: 'Reviewer handoff unclear',
        reason: 'No independent reviewer is confirmed for this request.',
      },
    },
    {
      id: 'reviewer-conflict',
      label: 'Reviewer records disagree',
      stepIds: ['check-draft'],
      evidenceIds: ['reviewer-disagreement'],
      conditions: [
        { ruleId: 'draft-prepared', state: 'met' },
        { ruleId: 'reviewer-independent', state: 'conflicting' },
      ],
      outcome: {
        status: 'conflicting',
        result: 'Reviewer independence disputed',
        reason:
          'One invented record assigns an independent reviewer; another assigns the writer. The handoff outcome is unresolved.',
      },
    },
  ],
}

const approveArticle: ApprovalFeature & KnowledgeBindings = {
  id: 'approve-article',
  title: 'Approve the article request',
  actor: 'Reviewer',
  purpose:
    'See whether the pending request is ready for an independent reviewer to approve.',
  group: 'Field Notes · Editorial',
  essentialOrder: 1,
  scene: { kind: 'approval', version: 1 },
  requiredApprovals: 2,
  revisionLabel: 'Publishing Studio fixture v2',
  evidence: {
    ...evidence,
    sourceRevision: 'publishing-studio-fixture-v2',
    description:
      'Invented example: the fictional review request requires two independent approvals. No source product behavior was inspected.',
  },
  actorIds: ['reviewer'],
  ruleIds: ['reviewer-independent', 'two-approvals', 'request-pending'],
  areaId: 'editorial',
  evidenceIds: ['approval-example'],
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

const publishArticle: NavigationFeature & KnowledgeBindings = {
  id: 'publish-article',
  title: 'Publish the Field Notes issue',
  actor: 'Editor',
  purpose: 'Place an approved article in a selected Field Notes issue.',
  group: 'Field Notes · Editorial',
  essentialOrder: 2,
  scene: { kind: 'navigation', version: 1 },
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  actorIds: ['editor'],
  ruleIds: ['review-approved', 'issue-assigned'],
  areaId: 'editorial',
  evidenceIds: ['editorial-example'],
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

const findPublishedArticle: NavigationFeature & KnowledgeBindings = {
  id: 'find-published-article',
  title: 'Find the published article',
  actor: 'Reader',
  purpose: 'Locate “Harbor Walks” in the Field Notes issue.',
  group: 'Field Notes · Reader',
  scene: { kind: 'navigation', version: 1 },
  revisionLabel: 'Publishing Studio fixture v1',
  evidence,
  actorIds: ['reader'],
  ruleIds: ['published-listing'],
  areaId: 'reader',
  evidenceIds: ['editorial-example'],
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
  contractVersion: 2,
  id: 'publishing-studio',
  title: 'Publishing Studio · Demo',
  purpose: {
    text: 'Help a team prepare, review, and publish a Field Notes article, then help readers find it.',
    evidenceIds: ['editorial-example'],
  },
  evidenceRecords: [
    { id: 'editorial-example', ...evidence },
    { id: 'approval-example', ...approveArticle.evidence },
    {
      id: 'reviewer-unverified',
      ...evidence,
      status: 'uncertain',
      description:
        'Invented example: the prepared draft has no confirmed reviewer assignment. No source product was inspected.',
    },
    {
      id: 'reviewer-disagreement',
      ...evidence,
      status: 'conflicting',
      description:
        'Invented example: two fictional assignment records disagree about reviewer independence. No source product was inspected.',
    },
  ],
  actors: [
    {
      id: 'writer',
      name: 'Writer',
      description: 'Prepares the article and requests review.',
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'reviewer',
      name: 'Reviewer',
      description:
        'Receives a review request and assesses its approval conditions.',
      evidenceIds: ['editorial-example', 'approval-example'],
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Places an approved article in a selected issue.',
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'reader',
      name: 'Reader',
      description: 'Finds published articles in the issue listing.',
      evidenceIds: ['editorial-example'],
    },
  ],
  rules: [
    {
      id: 'draft-prepared',
      title: 'Draft prepared',
      statement:
        'A complete draft includes the story, summary, and image credit before review is requested.',
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'image-permission',
      title: 'Image permission confirmed',
      statement:
        'Image permission must be confirmed before the draft is ready for review.',
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'reviewer-independent',
      title: 'Independent reviewer assigned',
      statement:
        'A reviewer other than the writer must receive the review request; writers cannot approve their own request.',
      evidenceIds: ['editorial-example', 'approval-example'],
    },
    {
      id: 'two-approvals',
      title: 'Two independent approvals',
      statement:
        'The pending request needs at least two independent approvals.',
      evidenceIds: ['approval-example'],
    },
    {
      id: 'request-pending',
      title: 'Request still pending',
      statement: 'Only a pending request can be approved.',
      evidenceIds: ['approval-example'],
    },
    {
      id: 'review-approved',
      title: 'Review approved',
      statement: 'The review request must be approved before publication.',
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'issue-assigned',
      title: 'Issue selected',
      statement:
        'The editor must assign an issue for the article before publication.',
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'published-listing',
      title: 'Published article listed',
      statement:
        'A published article appears in its assigned issue listing; an unpublished draft has no public listing.',
      evidenceIds: ['editorial-example'],
    },
  ],
  areas: [
    {
      id: 'editorial',
      title: 'Field Notes · Editorial',
      description: 'Prepare, review, approve, and publish the article.',
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'reader',
      title: 'Field Notes · Reader',
      description: 'Discover the published article in its issue.',
      evidenceIds: ['editorial-example'],
    },
  ],
  journeys: [
    {
      id: 'article-to-reader',
      title: 'From draft to reader',
      goal: 'Prepare Harbor Walks, request independent review, approve and publish it, then find the article in its issue.',
      evidenceIds: ['editorial-example', 'approval-example'],
      steps: [
        { featureId: 'prepare-article' },
        { featureId: 'request-review', stepId: 'assign-reviewer' },
        { featureId: 'approve-article' },
        { featureId: 'publish-article' },
        { featureId: 'find-published-article' },
      ],
    },
  ],
  glossary: [
    {
      id: 'independent-review',
      term: 'Independent review',
      definition: 'A review by someone other than the writer requesting it.',
      featureIds: ['request-review', 'approve-article'],
      ruleIds: ['reviewer-independent', 'two-approvals'],
      evidenceIds: ['editorial-example', 'approval-example'],
    },
    {
      id: 'issue',
      term: 'Issue',
      definition:
        'A named collection of published Field Notes articles, such as the September issue.',
      featureIds: ['publish-article', 'find-published-article'],
      ruleIds: ['issue-assigned', 'published-listing'],
      evidenceIds: ['editorial-example'],
    },
    {
      id: 'image-credit',
      term: 'Image credit',
      definition:
        'The recorded attribution for the image accompanying an article.',
      featureIds: ['prepare-article', 'request-review'],
      ruleIds: ['draft-prepared'],
      evidenceIds: ['editorial-example'],
    },
  ],
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
