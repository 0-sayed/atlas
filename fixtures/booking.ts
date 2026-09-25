import type { CreateRequest } from '../shared/contracts.js'
export const seed: CreateRequest = {
  contractVersion: 1,
  id: 'booking-demo',
  title: 'Illustrative booking guide',
  relations: [],
  features: [
    {
      id: 'booking',
      title: 'Reschedule a booking',
      actor: 'Customer',
      purpose: 'Move your confirmed booking to an available time.',
      scene: {
        kind: 'booking',
        version: 1,
      },
      noticeHours: 24,
      revisionLabel: 'Booking fixture v2',
      evidence: {
        status: 'demo',
        source: 'Atlas authored fixture',
        sourceRevision: 'fixture-v2',
        scope: 'Illustrative booking only',
        description:
          'Illustrative rules authored for this prototype. No source application, PR or deployed behavior has been verified.',
      },
      assetIds: [],
      cases: [
        {
          id: 'at-limit',
          label: 'Exactly 24 hours',
          hours: 24,
          owner: 'you',
          confirmed: true,
          slot: 'free',
        },
        {
          id: 'too-late',
          label: 'Less than 24 hours',
          hours: 23,
          owner: 'you',
          confirmed: true,
          slot: 'free',
        },
        {
          id: 'occupied',
          label: 'Slot occupied',
          hours: 24,
          owner: 'you',
          confirmed: true,
          slot: 'occupied',
        },
        {
          id: 'other-owner',
          label: 'Someone else’s booking',
          hours: 24,
          owner: 'other',
          confirmed: true,
          slot: 'free',
        },
        {
          id: 'unknown',
          label: 'Availability unknown',
          hours: 24,
          owner: 'you',
          confirmed: true,
          slot: 'unknown',
        },
      ],
      comparison: {
        title: 'More time to change your plans',
        hours: 36,
        beforeNoticeHours: 48,
        beforeRevision: 'Booking fixture v1 · Historical',
      },
    },
  ],
}
