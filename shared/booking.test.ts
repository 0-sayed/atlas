import { expect, it } from 'vitest'
import { seed } from '../fixtures/booking.js'
import { bookingView } from './booking.js'
it('derives current cases and restrictions from one rule while keeping the historical snapshot', () => {
  const view = bookingView({ ...seed.features[0], noticeHours: 40 })
  expect(view.bookingRestrictions).toContain(
    'At least 40 hours before the original start',
  )
  expect(view.getBookingCase('at-limit')?.outcome).toBe('blocked')
  expect(view.bookingChange.after.example.outcome).toBe('blocked')
  expect(view.bookingChange.before.noticeHours).toBe(48)
  expect(view.bookingChange.after.noticeHours).toBe(40)
  expect(view.getBookingCase('unknown')?.outcome).toBe('blocked')
})
it('does not present unconfirmed cases as confirmed or allowed', () => {
  const view = bookingView({
    ...seed.features[0],
    cases: [{ ...seed.features[0].cases[0], confirmed: false }],
  })
  expect(view.bookingCases[0].outcome).toBe('blocked')
  expect(view.bookingCases[0].result).toBe('Booking is not confirmed')
})
