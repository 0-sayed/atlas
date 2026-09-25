import type { NavigationCase } from '../../shared/contracts'

export function NavigationArt() {
  return (
    <svg viewBox="0 0 320 220" aria-hidden="true" className="navigation-art">
      <rect
        x="18"
        y="45"
        width="108"
        height="130"
        rx="16"
        fill="#f8f3e9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M36 77h70M36 97h50M36 117h58"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M140 110h36m-12-12 12 12-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="194"
        y="45"
        width="108"
        height="130"
        rx="16"
        fill="#dbe8d9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M214 77h65M214 97h45M214 117h55"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NavigationScene({ example }: { example: NavigationCase }) {
  return (
    <div
      className="navigation-scene"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="navigation-start">
        <p className="eyebrow">Starting point</p>
        <p>{example.start}</p>
      </div>
      <div className="navigation-action">
        <span aria-hidden="true">→</span>
        <p>{example.action}</p>
      </div>
      <div className="navigation-result">
        <p className="eyebrow">
          {example.outcome === 'available'
            ? 'Available'
            : example.outcome === 'unavailable'
              ? 'Unavailable'
              : 'Unknown'}
        </p>
        <h2>{example.result}</h2>
        <p>{example.reason}</p>
      </div>
    </div>
  )
}
