export type BookingCase = {
  id: string
  label: string
  hours: number
  owner: 'you' | 'other'
  confirmed: boolean
  slot: 'free' | 'occupied' | 'unknown'
  outcome: 'allowed' | 'blocked' | 'unknown'
  result: string
  reason: string
}

export const booking = {
  id: 'booking',
  title: 'Reschedule a booking',
  actor: 'Customer',
  purpose: 'Move your confirmed booking to an available time.',
  noticeHours: 24,
  revision: 'Booking fixture v2',
  evidence:
    'Illustrative rules authored for this prototype. No source application, PR or deployed behavior has been verified.',
}

export const bookingRestrictions = [
  'Your own booking',
  'Confirmed booking',
  `At least ${booking.noticeHours} hours before the original start`,
  'Replacement slot must be free',
]

const usualConditions = {
  hours: booking.noticeHours,
  owner: 'you',
  confirmed: true,
  slot: 'free',
} as const

export const bookingCases: readonly BookingCase[] = [
  {
    ...usualConditions,
    id: 'at-limit',
    label: `Exactly ${booking.noticeHours} hours`,
    outcome: 'allowed',
    result: 'Booking moved',
    reason: `Exactly ${booking.noticeHours} hours meets the “at least” notice requirement. You own this confirmed booking and the replacement slot is free.`,
  },
  {
    ...usualConditions,
    id: 'too-late',
    label: `Less than ${booking.noticeHours} hours`,
    hours: 23,
    outcome: 'blocked',
    result: 'Too late to move',
    reason: `Only 23 hours remain before the original start. The required notice is at least ${booking.noticeHours} hours; ownership, confirmation and the free slot do not override it.`,
  },
  {
    ...usualConditions,
    id: 'occupied',
    label: 'Slot occupied',
    slot: 'occupied',
    outcome: 'blocked',
    result: 'Choose another slot',
    reason:
      'The replacement slot is occupied. The time, ownership and confirmation conditions pass, but this slot cannot be used.',
  },
  {
    ...usualConditions,
    id: 'other-owner',
    label: 'Someone else’s booking',
    owner: 'other',
    outcome: 'blocked',
    result: 'Not yours to move',
    reason:
      'A customer may only move their own confirmed booking. This one belongs to someone else, even though the time and free-slot conditions pass.',
  },
  {
    ...usualConditions,
    id: 'unknown',
    label: 'Availability unknown',
    slot: 'unknown',
    outcome: 'unknown',
    result: 'Outcome not established',
    reason:
      'This saved example does not establish whether the replacement slot is free. The other conditions pass, but the recorded information cannot establish an outcome.',
  },
]

const comparisonConditions = { ...usualConditions, hours: 36 }
export const bookingChange = {
  title: 'More time to change your plans',
  before: {
    revision: 'Booking fixture v1 · Historical',
    noticeHours: 48,
    example: {
      ...comparisonConditions,
      id: 'change-before',
      label: 'Previous rule',
      outcome: 'blocked',
      result: 'Previously blocked',
      reason: '36 hours did not meet the previous 48-hour notice requirement.',
    } satisfies BookingCase,
  },
  after: {
    revision: `${booking.revision} · Current`,
    noticeHours: booking.noticeHours,
    example: {
      ...comparisonConditions,
      id: 'change-now',
      label: '36 hours · Current rule',
      outcome: 'allowed',
      result: 'Now allowed',
      reason: `36 hours meets the current ${booking.noticeHours}-hour notice requirement. This is your confirmed booking and the replacement slot is free.`,
    } satisfies BookingCase,
  },
}

export function getBookingCase(id: string): BookingCase | undefined {
  return [...bookingCases, bookingChange.after.example].find(
    (item) => item.id === id,
  )
}

export function isBelowNoticeRequirement(
  item: Pick<BookingCase, 'hours'>,
): boolean {
  return item.hours < booking.noticeHours
}

export function matchesBooking(query: string): boolean {
  const searchable =
    `${booking.title} ${booking.purpose} ${booking.actor}`.toLowerCase()
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .every((word) => searchable.includes(word))
}
