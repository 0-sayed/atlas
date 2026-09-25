import type { Feature, SavedCase } from './contracts.js'
export type BookingCase = SavedCase & {
  outcome: 'allowed' | 'blocked' | 'unknown'
  result: string
  reason: string
}
function explain(item: SavedCase, notice: number): BookingCase {
  if (item.owner === 'other')
    return {
      ...item,
      outcome: 'blocked',
      result: 'Not yours to move',
      reason:
        'Only the owner may move their confirmed booking. This one belongs to someone else.',
    }
  if (!item.confirmed)
    return {
      ...item,
      outcome: 'blocked',
      result: 'Booking is not confirmed',
      reason: 'Only a confirmed booking can be moved.',
    }
  if (item.hours < notice)
    return {
      ...item,
      outcome: 'blocked',
      result: 'Too late to move',
      reason: `Only ${item.hours} hours remain before the original start. The required notice is at least ${notice} hours; ownership, confirmation and the free slot do not override it.`,
    }
  if (item.slot === 'occupied')
    return {
      ...item,
      outcome: 'blocked',
      result: 'Choose another slot',
      reason:
        'The replacement slot is occupied. The time, ownership and confirmation conditions pass, but this slot cannot be used.',
    }
  if (item.slot === 'unknown')
    return {
      ...item,
      outcome: 'unknown',
      result: 'Outcome not established',
      reason:
        'This saved example does not establish whether the replacement slot is free. The other conditions pass, but the recorded information cannot establish an outcome.',
    }
  return {
    ...item,
    outcome: 'allowed',
    result: 'Booking moved',
    reason: `${item.hours} hours meets the “at least ${notice} hours” notice requirement. You own this confirmed booking and the replacement slot is free.`,
  }
}
export function bookingView(feature: Feature) {
  const booking = {
    id: feature.id,
    title: feature.title,
    actor: feature.actor,
    purpose: feature.purpose,
    noticeHours: feature.noticeHours,
    revision: feature.revisionLabel,
    evidence: feature.evidence.description,
    status: feature.evidence.status,
    assetIds: feature.assetIds,
  }
  const bookingCases = feature.cases.map((c) => explain(c, feature.noticeHours))
  const input: SavedCase = {
    id: 'change-now',
    label: `${feature.comparison.hours} hours · Current rule`,
    hours: feature.comparison.hours,
    owner: 'you',
    confirmed: true,
    slot: 'free',
  }
  const after = explain(input, feature.noticeHours)
  const before = explain(
    { ...input, id: 'change-before', label: 'Previous rule' },
    feature.comparison.beforeNoticeHours,
  )
  const bookingChange = {
    title: feature.comparison.title,
    before: {
      revision: feature.comparison.beforeRevision,
      noticeHours: feature.comparison.beforeNoticeHours,
      example: {
        ...before,
        result:
          before.outcome === 'allowed'
            ? 'Previously allowed'
            : 'Previously blocked',
      },
    },
    after: {
      revision: `${feature.revisionLabel} · Current`,
      noticeHours: feature.noticeHours,
      example: {
        ...after,
        result: after.outcome === 'allowed' ? 'Now allowed' : 'Now blocked',
      },
    },
  }
  return {
    booking,
    defaultCaseId: bookingCases[0]?.id ?? bookingChange.after.example.id,
    bookingCases,
    bookingChange,
    bookingRestrictions: [
      'Your own booking',
      'Confirmed booking',
      `At least ${feature.noticeHours} hours before the original start`,
      'Replacement slot must be free',
    ],
    getBookingCase: (id: string) =>
      [...bookingCases, bookingChange.after.example].find((c) => c.id === id),
    isBelowNoticeRequirement: (item: Pick<BookingCase, 'hours'>) =>
      item.hours < feature.noticeHours,
    matchesBooking: (query: string) =>
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .every((word) =>
          `${feature.title} ${feature.purpose} ${feature.actor}`
            .toLowerCase()
            .includes(word),
        ),
  }
}
