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

function StepIllustration({
  step,
  outcome,
}: {
  step: 'start' | 'action' | 'result'
  outcome: NavigationCase['outcome']
}) {
  if (step === 'start') {
    return (
      <svg viewBox="0 0 160 132" aria-hidden="true" focusable="false">
        <ellipse
          cx="80"
          cy="112"
          rx="65"
          ry="12"
          fill="#8ac7d7"
          opacity=".35"
        />
        <rect
          x="26"
          y="17"
          width="108"
          height="86"
          rx="10"
          fill="#255577"
          stroke="#17354d"
          strokeWidth="4"
        />
        <path
          d="M28 34h104v58a9 9 0 0 1-9 9H37a9 9 0 0 1-9-9Z"
          fill="#fffdf5"
        />
        <circle cx="40" cy="26" r="3" fill="#fff" />
        <circle cx="51" cy="26" r="3" fill="#fff" />
        <rect x="44" y="49" width="72" height="8" rx="4" fill="#91c7c7" />
        <rect x="44" y="65" width="55" height="7" rx="3.5" fill="#c8dfe0" />
        <rect x="44" y="79" width="64" height="7" rx="3.5" fill="#c8dfe0" />
        <path
          d="m110 91 11 14-9 1-5 9-7-22Z"
          fill="#f5a769"
          stroke="#17354d"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (step === 'action') {
    return (
      <svg viewBox="0 0 160 132" aria-hidden="true" focusable="false">
        <ellipse
          cx="80"
          cy="112"
          rx="62"
          ry="12"
          fill="#8ac7d7"
          opacity=".35"
        />
        <rect
          x="26"
          y="17"
          width="108"
          height="87"
          rx="10"
          fill="#357a7e"
          stroke="#17354d"
          strokeWidth="4"
        />
        <rect x="35" y="27" width="90" height="67" rx="5" fill="#fffdf5" />
        <path
          d="M49 42h59M49 53h43"
          stroke="#8cb8bc"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect
          x="50"
          y="67"
          width="62"
          height="17"
          rx="8.5"
          fill="#f3ac75"
          stroke="#17354d"
          strokeWidth="2"
        />
        <path
          d="m95 74 12 14-9 1-5 10-7-23Z"
          fill="#fffdf5"
          stroke="#17354d"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 160 132" aria-hidden="true" focusable="false">
      <ellipse cx="80" cy="112" rx="62" ry="12" fill="#8ac7d7" opacity=".35" />
      <rect
        x="30"
        y="25"
        width="100"
        height="79"
        rx="9"
        fill="#fffdf5"
        stroke="#17354d"
        strokeWidth="4"
      />
      <path
        d="M44 45h45M44 60h55M44 75h37"
        stroke="#9ac8ce"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle
        cx="119"
        cy="42"
        r="22"
        fill={
          outcome === 'available'
            ? '#49ad7d'
            : outcome === 'unavailable'
              ? '#e87a67'
              : '#e6b957'
        }
        stroke="#17354d"
        strokeWidth="4"
      />
      {outcome === 'available' ? (
        <path
          d="m108 42 8 8 14-17"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : outcome === 'unavailable' ? (
        <path
          d="m111 34 16 16m0-16-16 16"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ) : (
        <text
          x="119"
          y="52"
          textAnchor="middle"
          fill="#17354d"
          fontSize="29"
          fontWeight="800"
        >
          ?
        </text>
      )}
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
      data-outcome={example.outcome}
    >
      <div className="navigation-step navigation-start">
        <span className="navigation-step-number">1</span>
        <StepIllustration step="start" outcome={example.outcome} />
        <p className="eyebrow">Starting point</p>
        <p>{example.start}</p>
      </div>
      <span className="navigation-step-arrow" aria-hidden="true">
        →
      </span>
      <div className="navigation-step navigation-action">
        <span className="navigation-step-number">2</span>
        <StepIllustration step="action" outcome={example.outcome} />
        <p className="eyebrow">Action</p>
        <p>{example.action}</p>
      </div>
      <span className="navigation-step-arrow" aria-hidden="true">
        →
      </span>
      <div className="navigation-step navigation-result">
        <span className="navigation-step-number">3</span>
        <StepIllustration step="result" outcome={example.outcome} />
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
