import type { ReactNode } from 'react'
import { type BookingCase } from '../content/booking'

import { AtlasIcon } from '../components/AtlasIcon'
import { RecordedCaseOutcome } from '../components/RecordedCaseLayout'

export function CalendarArt({
  state = 'ready',
}: {
  state?: 'ready' | 'occupied' | 'unknown' | 'moved' | 'blocked'
}) {
  return (
    <span className={`calendar-art art-${state}`} aria-hidden="true">
      <AtlasIcon name="clock" />
      <AtlasIcon
        name={
          state === 'unknown'
            ? 'warning'
            : state === 'blocked' || state === 'occupied'
              ? 'close'
              : 'check'
        }
      />
    </span>
  )
}

export function BookingScene({
  example,
  noticeHours,
  actor,
  evidence,
}: {
  example: BookingCase
  noticeHours: number
  actor: string
  evidence: ReactNode
}) {
  const blocked = example.outcome === 'blocked'
  const slotLabel =
    example.slot === 'free'
      ? 'Replacement slot is free'
      : example.slot === 'occupied'
        ? 'Replacement slot is occupied'
        : 'Slot availability unknown'
  const bookingLabel =
    example.owner === 'you'
      ? example.confirmed
        ? 'Your confirmed booking'
        : 'Your unconfirmed booking'
      : 'Someone else’s booking'
  const bookingDetail =
    example.owner === 'you'
      ? `Actor: ${actor}`
      : example.confirmed
        ? 'Confirmed, but not owned by you'
        : 'Unconfirmed and not owned by you'
  const slotDetail =
    example.slot === 'unknown'
      ? 'This information is missing'
      : example.slot === 'occupied'
        ? 'Another booking is already here'
        : 'A new time is available'
  return (
    <RecordedCaseOutcome
      outcome={example.outcome}
      result={example.result}
      consequence={
        example.outcome === 'allowed'
          ? 'The booking moves to the free slot.'
          : blocked
            ? 'The original booking stays in place.'
            : 'No success or failure can be established.'
      }
      condition={example.reason}
      facts={
        <dl
          className="recorded-case-facts"
          aria-label="Recorded case conditions"
        >
          <div>
            <dt>The booking</dt>
            <dd>{bookingLabel}</dd>
            <dd>{bookingDetail}</dd>
          </div>
          <div>
            <dt>The notice</dt>
            <dd>{example.hours} hours remaining</dd>
            <dd>Before the original start · {noticeHours} hours required</dd>
          </div>
          <div>
            <dt>The new slot</dt>
            <dd>{slotLabel}</dd>
            <dd>{slotDetail}</dd>
          </div>
        </dl>
      }
      evidence={evidence}
    />
  )
}
