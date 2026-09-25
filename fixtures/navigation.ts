// Synthetic test data only; this is not evidence about Atlas or another product.
export const navigationFeature = {
  id: 'navigation',
  title: 'Open a saved guide',
  actor: 'Reader',
  purpose: 'See where a saved choice leads.',
  scene: { kind: 'navigation' as const, version: 1 as const },
  revisionLabel: 'Navigation fixture v1',
  evidence: {
    status: 'demo' as const,
    source: 'Authored navigation fixture',
    sourceRevision: 'navigation-fixture-v1',
    scope: 'Synthetic navigation examples only',
    description: 'Invented examples, not verified product behavior.',
  },
  assetIds: [],
  rules: ['Only saved guides can be opened.'],
  cases: [
    {
      id: 'saved',
      label: 'Saved guide',
      start: 'A guide is saved.',
      action: 'Open guide',
      result: 'Guide opens',
      reason: 'The selected guide exists.',
      outcome: 'available' as const,
    },
    {
      id: 'missing',
      label: 'Missing guide',
      start: 'No guide is saved.',
      action: 'Open guide',
      result: 'Guide unavailable',
      reason: 'The selected guide is missing.',
      outcome: 'unavailable' as const,
    },
    {
      id: 'unknown',
      label: 'Unverified destination',
      start: 'The destination was not inspected.',
      action: 'Open destination',
      result: 'Destination not established',
      reason: 'There is no supporting evidence.',
      outcome: 'unknown' as const,
    },
  ],
}
export const navigationSeed = {
  contractVersion: 1 as const,
  id: 'navigation-demo',
  title: 'Illustrative navigation guide',
  features: [navigationFeature],
  relations: [],
}
