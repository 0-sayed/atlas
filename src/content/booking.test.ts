import { describe, expect, it } from 'vitest'
import {
  booking,
  bookingCases,
  bookingChange,
  getBookingCase,
  matchesBooking,
} from './booking'

describe('recorded booking explanations', () => {
  it('preserves the inclusive notice boundary and the isolated time exception', () => {
    expect(getBookingCase('at-limit')).toMatchObject({
      hours: 24,
      owner: 'you',
      confirmed: true,
      slot: 'free',
      outcome: 'allowed',
    })
    expect(getBookingCase('too-late')).toMatchObject({
      hours: 23,
      owner: 'you',
      confirmed: true,
      slot: 'free',
      outcome: 'blocked',
    })
  })
  it('isolates occupied slot and ownership from time and confirmation', () => {
    expect(getBookingCase('occupied')).toMatchObject({
      hours: 24,
      owner: 'you',
      confirmed: true,
      slot: 'occupied',
      outcome: 'blocked',
    })
    expect(getBookingCase('other-owner')).toMatchObject({
      hours: 24,
      owner: 'other',
      confirmed: true,
      slot: 'free',
      outcome: 'blocked',
    })
  })
  it('never substitutes success for an unknown case or missing knowledge', () => {
    expect(getBookingCase('unknown')).toMatchObject({
      slot: 'unknown',
      outcome: 'unknown',
    })
    expect(getBookingCase('missing')).toBeUndefined()
    expect(getBookingCase('')).toBeUndefined()
    expect(new Set(bookingCases.map((item) => item.id)).size).toBe(
      bookingCases.length,
    )
  })
  it('compares the same inputs against explicit historical and current snapshots', () => {
    expect(bookingChange.before.noticeHours).toBe(48)
    expect(bookingChange.after.noticeHours).toBe(booking.noticeHours)
    expect(bookingChange.before.example).toMatchObject({
      hours: 36,
      owner: 'you',
      confirmed: true,
      slot: 'free',
      outcome: 'blocked',
    })
    expect(bookingChange.after.example).toMatchObject({
      hours: 36,
      owner: 'you',
      confirmed: true,
      slot: 'free',
      outcome: 'allowed',
    })
    expect(getBookingCase('change-now')).toEqual(bookingChange.after.example)
  })
  it.each([
    ['', true],
    ['  MOVE  ', true],
    ['booking', true],
    ['reschedule', true],
    ['refund', false],
    ['<script>', false],
  ])('searches the activity for %s', (query, expected) => {
    expect(matchesBooking(query)).toBe(expected)
  })
})
