import { Link } from 'react-router'
import { useBooking, useProject, projectPath } from '../content/knowledge'
import { CalendarArt } from '../scenes/BookingScene'
export function BookingComparison() {
  const { bookingChange, booking } = useBooking()
  const project = useProject()
  return (
    <section className="changes-page" aria-labelledby="page-title">
      <p className="eyebrow">A small rule. A different possibility.</p>

      <div className="change-heading">
        <h2>{bookingChange.title}</h2>
        <p>
          The notice requirement changed from {bookingChange.before.noticeHours}{' '}
          to {bookingChange.after.noticeHours} hours.
        </p>
      </div>
      <div className="comparison-context">
        <span className="context-number">
          {bookingChange.after.example.hours}
          <small>hours remaining</small>
        </span>
        <div>
          <strong>The same booking. The same free slot.</strong>
          <p>
            Your confirmed booking, before its original start. Only the notice
            rule changes.
          </p>
        </div>
      </div>
      <div className="comparison-grid">
        {[bookingChange.before, bookingChange.after].map((snapshot) => (
          <article
            key={snapshot.revision}
            className={`comparison-card outcome-${snapshot.example.outcome}`}
          >
            <p className="eyebrow">{snapshot.revision}</p>
            <CalendarArt
              state={
                snapshot.example.outcome === 'allowed' ? 'moved' : 'blocked'
              }
            />
            <p className="notice-rule">
              At least {snapshot.noticeHours} hours’ notice
            </p>
            <h2>{snapshot.example.result}</h2>
            <p>{snapshot.example.reason}</p>
          </article>
        ))}
      </div>
      <div className="comparison-footer">
        <p>
          {booking.status === 'demo'
            ? 'A recorded fixture comparison, not a production release or measured business impact.'
            : 'A recorded historical comparison, not proof of a production release or measured business impact.'}
        </p>
        <Link
          className="primary-link"
          to={`${projectPath(project.id)}/explore/${booking.id}?case=change-now&from=changes`}
        >
          Explore this change <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  )
}
