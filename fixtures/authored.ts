/** Synthetic logistics knowledge for isolated contract and browser tests only. */
export const authoredEvidence = {
  status: 'demo' as const,
  source: 'Synthetic logistics specification',
  sourceRevision: 'demo-1',
  scope: 'Illustrative handoff only; no real-source claim',
  description: 'Authored for isolated tests, not observed product behavior.',
}
export const authoredFeature = {
  id: 'handoff',
  title: 'Hand off a parcel',
  actor: 'Dispatcher and courier',
  purpose: 'Explain the recorded parcel handoff and its checklist restriction.',
  group: 'Dispatch',
  revisionLabel: 'Synthetic example',
  evidence: authoredEvidence,
  evidenceIds: ['source'],
  assetIds: [],
  presentation: { illustration: 'parcel' as const, accent: 'sage' as const },
  scene: { kind: 'authored' as const, version: 1 as const },
  actorIds: ['dispatcher', 'courier'],
  ruleIds: ['complete'],
  areaId: 'dispatch',
  steps: [
    {
      id: 'prepare',
      title: 'Prepare the parcel',
      description: 'The dispatcher checks the recorded checklist.',
      actorIds: ['dispatcher'],
      ruleIds: ['complete'],
      evidenceIds: ['source'],
    },
    {
      id: 'receive',
      title: 'Receive the parcel',
      description: 'The courier receives the prepared parcel.',
      actorIds: ['courier'],
      ruleIds: [],
      evidenceIds: ['source'],
    },
  ],
  cases: [
    {
      id: 'ready',
      label: 'Complete handoff',
      stepIds: ['prepare', 'receive'],
      conditions: [{ ruleId: 'complete', state: 'met' as const }],
      outcome: {
        status: 'allowed' as const,
        result: 'Parcel handed over',
        reason: 'The required checklist is complete.',
      },
      evidenceIds: ['source'],
    },
    {
      id: 'incomplete',
      label: 'Incomplete handoff',
      stepIds: ['prepare'],
      conditions: [{ ruleId: 'complete', state: 'not-met' as const }],
      outcome: {
        status: 'blocked' as const,
        result: 'Handoff stopped',
        reason: 'The required checklist is incomplete.',
      },
      evidenceIds: ['source'],
    },
    {
      id: 'unknown',
      label: 'Unverified handoff',
      stepIds: [],
      conditions: [{ ruleId: 'complete', state: 'unknown' as const }],
      outcome: {
        status: 'unknown' as const,
        result: 'Handoff outcome not established',
      },
      evidenceIds: ['unverified'],
    },
    {
      id: 'conflict',
      label: 'Conflicting handoff',
      stepIds: ['prepare'],
      conditions: [{ ruleId: 'complete', state: 'conflicting' as const }],
      outcome: {
        status: 'conflicting' as const,
        result: 'Conflicting recorded outcomes',
        reason:
          'The inspected examples disagree; no single outcome is established.',
      },
      evidenceIds: ['disagreement'],
    },
  ],
}
export const authoredSeed = {
  contractVersion: 2 as const,
  id: 'logistics-demo',
  title: 'Logistics Lab · synthetic',
  purpose: {
    text: 'Explain illustrative parcel dispatch.',
    evidenceIds: ['source'],
  },
  evidenceRecords: [
    { id: 'source', ...authoredEvidence },
    {
      id: 'unverified',
      ...authoredEvidence,
      status: 'uncertain' as const,
      description: 'Checklist state has not been established.',
    },
    {
      id: 'disagreement',
      ...authoredEvidence,
      status: 'conflicting' as const,
      description: 'The inspected examples record incompatible outcomes.',
    },
  ],
  actors: [
    { id: 'dispatcher', name: 'Dispatcher', evidenceIds: ['source'] },
    {
      id: 'courier',
      name: 'Courier',
      description: 'Receives the parcel in this example.',
      evidenceIds: ['source'],
    },
  ],
  rules: [
    {
      id: 'complete',
      title: 'Checklist complete',
      statement:
        'All required checklist entries must be complete before handoff.',
      evidenceIds: ['source'],
    },
  ],
  areas: [{ id: 'dispatch', title: 'Dispatch', evidenceIds: ['source'] }],
  journeys: [
    {
      id: 'delivery',
      title: 'Parcel handoff',
      goal: 'Transfer a prepared parcel to a courier.',
      steps: [
        { featureId: 'handoff', stepId: 'prepare' },
        { featureId: 'handoff', stepId: 'receive' },
      ],
      evidenceIds: ['source'],
    },
  ],
  glossary: [
    {
      id: 'checklist',
      term: 'Checklist',
      definition: 'The recorded list of handoff prerequisites.',
      featureIds: ['handoff'],
      ruleIds: ['complete'],
      evidenceIds: ['source'],
    },
  ],
  features: [authoredFeature],
  relations: [],
}
