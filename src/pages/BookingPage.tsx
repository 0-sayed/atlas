import { useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { useBooking } from '../content/knowledge'
import { RegisteredArt } from '../components/RegisteredArt'
import { BookingScene } from '../scenes/BookingScene'
import { FixtureLabel, MissingPage } from './GuidePages'

export function BookingPage() {
  const {
    booking,
    bookingCases,
    bookingChange,
    bookingRestrictions,
    getBookingCase,
    defaultCaseId,
  } = useBooking()
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const example = getBookingCase(params.get('case') ?? defaultCaseId)
  const [detailOpen, setDetailOpen] = useState(false)
  const detailTrigger = useRef<HTMLButtonElement>(null)
  if (!example) return <MissingPage />
  const origin = params.get('from')
  const returnPath =
    origin === 'start'
      ? '/'
      : origin === 'changes'
        ? '/changes'
        : `/explore${params.get('q') ? `?${new URLSearchParams({ q: params.get('q')! })}` : ''}`
  const returnLabel =
    origin === 'start'
      ? 'Back to Start here'
      : origin === 'changes'
        ? 'Back to What changed'
        : 'Back to Explore'
  const cases = [...bookingCases, bookingChange.after.example]
  return (
    <section className="booking-page" aria-labelledby="page-title">
      <Link
        className="back-link"
        to={returnPath}
        state={{ restorePosition: true }}
      >
        <span aria-hidden="true">← </span>
        {returnLabel}
      </Link>
      <FixtureLabel />
      <div className="feature-heading">
        <div>
          <p className="eyebrow">Booking / {booking.actor}</p>
          <h1 id="page-title">{booking.title}</h1>
          <p className="intro">{booking.purpose}</p>
        </div>
        <span className="scene-note">
          Same story.
          <br />
          Different conditions.
        </span>
      </div>
      <ul className="restrictions" aria-label="Essential restrictions">
        {bookingRestrictions.map((restriction) => (
          <li key={restriction}>{restriction}</li>
        ))}
      </ul>
      <div className="case-picker" role="group" aria-label="Saved cases">
        <span>Try a saved case</span>
        <div>
          {cases.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={example.id === item.id}
              onClick={() => {
                const next = new URLSearchParams(params)
                next.set('case', item.id)
                setParams(next, { state: location.state })
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {booking.assetIds.map((id) => (
        <RegisteredArt
          key={id}
          projectId="booking-demo"
          assetId={id}
          title={booking.title}
        />
      ))}
      <BookingScene
        example={example}
        noticeHours={booking.noticeHours}
        actor={booking.actor}
      />
      <div className="scene-actions">
        <button
          className="reason-trigger"
          type="button"
          ref={detailTrigger}
          aria-expanded={detailOpen}
          aria-controls="booking-detail"
          onClick={() => setDetailOpen(!detailOpen)}
        >
          Why this outcome?{' '}
          <span aria-hidden="true">{detailOpen ? '−' : '+'}</span>
        </button>
        <Link to="/changes">
          See what changed <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {detailOpen && (
        <aside
          id="booking-detail"
          className="detail-panel"
          aria-labelledby="reason-title"
        >
          <div>
            <p className="eyebrow">The reason</p>
            <h2 id="reason-title">{example.result}</h2>
            <p>{example.reason}</p>
            <h3>About this evidence</h3>
            <p>{booking.evidence}</p>
            <p className="revision-note">
              {booking.revision} · Saved illustrative case: {example.label}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDetailOpen(false)
              detailTrigger.current?.focus()
            }}
          >
            Close detail
          </button>
        </aside>
      )}
    </section>
  )
}
