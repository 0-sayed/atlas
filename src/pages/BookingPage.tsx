import { useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { useBooking, useProject, projectPath } from '../content/knowledge'
import { FeatureEvidence } from '../components/FeatureDetail'
import { RegisteredArt } from '../components/RegisteredArt'
import {
  RecordedCaseEvidence,
  RecordedCaseLayout,
} from '../components/RecordedCaseLayout'
import { BookingScene } from '../scenes/BookingScene'
import { FixtureLabel, MissingPage } from './GuidePages'
import './recorded-case.css'

export function BookingPage() {
  const {
    booking,
    bookingCases,
    bookingRestrictions,
    getBookingCase,
    defaultCaseId,
  } = useBooking()
  const project = useProject()
  const base = projectPath(project.id)
  const feature = project.features.find((f) => f.id === booking.id)!
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const requestedCaseId = params.get('case')
  const selectedId = requestedCaseId ?? defaultCaseId
  const example = selectedId ? getBookingCase(selectedId) : undefined
  const [detailOpen, setDetailOpen] = useState(false)
  const detailTrigger = useRef<HTMLButtonElement>(null)
  if (!example && (requestedCaseId !== null || bookingCases.length > 0))
    return <MissingPage />
  const origin = params.get('from')
  const returnPath =
    origin === 'start'
      ? base
      : `${base}/explore${params.get('q') ? `?${new URLSearchParams({ q: params.get('q')! })}` : ''}`
  const returnLabel =
    origin === 'start' ? 'Back to Start here' : 'Back to Explore'
  return (
    <section
      className="booking-page recorded-case-page"
      aria-labelledby="page-title"
    >
      <Link
        className="back-link"
        to={returnPath}
        state={{ restorePosition: true }}
      >
        {returnLabel}
      </Link>
      <FixtureLabel feature={feature} />
      <div className="feature-heading">
        <div>
          <p className="eyebrow">Booking / {booking.actor}</p>
          <h1 id="page-title">{booking.title}</h1>
          <p className="intro">{booking.purpose}</p>
        </div>
      </div>
      <ul className="restrictions" aria-label="Essential restrictions">
        {bookingRestrictions.map((restriction) => (
          <li key={restriction}>{restriction}</li>
        ))}
      </ul>
      {booking.assetIds.map((id) => (
        <RegisteredArt
          key={id}
          projectId={project.id}
          assetId={id}
          title={booking.title}
        />
      ))}
      {example ? (
        <RecordedCaseLayout
          cases={bookingCases.map((item) => ({
            id: item.id,
            label: item.label,
            outcome: item.outcome,
          }))}
          selectedId={example.id}
          onSelect={(id) => {
            const next = new URLSearchParams(params)
            next.set('case', id)
            setParams(next, { state: location.state })
          }}
        >
          <BookingScene
            example={example}
            noticeHours={booking.noticeHours}
            actor={booking.actor}
            evidence={<RecordedCaseEvidence feature={feature} />}
          />
        </RecordedCaseLayout>
      ) : (
        <div className="empty-search">
          <h2>No saved cases</h2>
          <p>
            The recorded rule is available, but no example outcome has been
            incorporated.
          </p>
        </div>
      )}
      <div className="scene-actions">
        <button
          className="reason-trigger"
          type="button"
          ref={detailTrigger}
          aria-expanded={detailOpen}
          aria-controls="booking-detail"
          onClick={() => setDetailOpen(!detailOpen)}
        >
          {example ? 'Why this outcome?' : 'More detail'}{' '}
          <span aria-hidden="true">{detailOpen ? '−' : '+'}</span>
        </button>
      </div>
      {detailOpen && (
        <aside
          id="booking-detail"
          className="detail-panel"
          aria-labelledby="reason-title"
        >
          <div>
            <h2 id="reason-title">
              {example
                ? 'Evidence for this outcome'
                : 'Evidence for this activity'}
            </h2>
            <FeatureEvidence feature={feature} />
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
