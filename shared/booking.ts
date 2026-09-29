import type { BookingFeature, SavedCase } from './contracts.js'
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
export function bookingView(feature: BookingFeature) {
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
  return {
    booking,
    defaultCaseId: bookingCases[0]?.id ?? '',
    bookingCases,
    bookingRestrictions: [
      'Your own booking',
      'Confirmed booking',
      `At least ${feature.noticeHours} hours before the original start`,
      'Replacement slot must be free',
    ],
    getBookingCase: (id: string) => bookingCases.find((c) => c.id === id),
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
