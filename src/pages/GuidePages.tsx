import { Link, useSearchParams } from 'react-router'
import { booking, bookingChange, matchesBooking } from '../content/booking'
import { CalendarArt } from '../scenes/BookingScene'

export function FixtureLabel() {
  return (
    <p className="fixture-label">
      <span aria-hidden="true">◇</span> Illustrative fixture ·{' '}
      {booking.revision} · Not a live booking app
    </p>
  )
}

export function StartPage() {
  return (
    <section className="start-page" aria-labelledby="page-title">
      <FixtureLabel />
      <div className="start-intro">
        <p className="eyebrow">A little exploration. A clearer picture.</p>
        <h1 id="page-title">Start here</h1>
        <p className="intro">
          See what a product lets you do.
          <br />
          Find out what changes the outcome.
        </p>
      </div>
      <Link
        className="activity-hero"
        to="/explore/booking?case=at-limit&from=start"
      >
        <div className="hero-art">
          <CalendarArt />
          <span className="art-spark" aria-hidden="true">
            ✦
          </span>
        </div>
        <div className="activity-copy">
          <p className="eyebrow">01 / Booking example</p>
          <h2>{booking.title}</h2>
          <p>{booking.purpose}</p>
          <span className="text-link">
            Explore the story <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
      <p className="start-note">
        One activity, a few different outcomes. Select a saved case to see what
        matters.
      </p>
    </section>
  )
}

export function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const destination = `/explore/booking?${new URLSearchParams({ case: 'at-limit', from: 'explore', q: query })}`
  return (
    <section className="explore-page" aria-labelledby="page-title">
      <FixtureLabel />
      <p className="eyebrow">Follow a question</p>
      <h1 id="page-title">Explore</h1>
      <p className="intro">What would you like to understand?</p>
      <form
        role="search"
        className="search-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="activity-search">Search activities</label>
        <div className="search-row">
          <input
            id="activity-search"
            type="search"
            placeholder="Try “move” or “booking”"
            value={query}
            onChange={(event) =>
              setParams(event.target.value ? { q: event.target.value } : {}, {
                replace: true,
              })
            }
          />
          {query && (
            <button
              type="button"
              onClick={() => setParams({}, { replace: true })}
            >
              Clear search
            </button>
          )}
        </div>
      </form>
      {matchesBooking(query) ? (
        <div className="activity-group">
          <p className="eyebrow">Bookings / 1 illustrative activity</p>
          <Link
            className="activity-card"
            aria-label={booking.title}
            to={destination}
          >
            <CalendarArt />
            <div>
              <h2>{booking.title}</h2>
              <p>{booking.purpose}</p>
              <span className="text-link">
                See the cases <span aria-hidden="true">↗</span>
              </span>
            </div>
          </Link>
        </div>
      ) : (
        <div className="empty-search">
          <h2>No matching activity</h2>
          <p>
            This fixture guide contains one booking activity. Try “booking” or
            clear your search.
          </p>
        </div>
      )}
    </section>
  )
}

export function ChangesPage() {
  return (
    <section className="changes-page" aria-labelledby="page-title">
      <FixtureLabel />
      <p className="eyebrow">A small rule. A different possibility.</p>
      <h1 id="page-title">What changed</h1>
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
          A recorded fixture comparison, not a production release or measured
          business impact.
        </p>
        <Link
          className="primary-link"
          to="/explore/booking?case=change-now&from=changes"
        >
          Explore this change <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  )
}

export function MissingPage() {
  return (
    <section className="missing-page" aria-labelledby="page-title">
      <p className="eyebrow">Atlas / Unavailable</p>
      <h1 id="page-title">This guide is not here yet</h1>
      <p className="intro">
        This link does not point to an available activity or saved case.
      </p>
      <Link className="primary-link" to="/explore">
        Return to Explore <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}
