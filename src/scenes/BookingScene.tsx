import { isBelowNoticeRequirement, type BookingCase } from '../content/booking'

// Original Atlas artwork. Decorative shapes; all meaning is also rendered as HTML.
export function CalendarArt({
  state = 'ready',
}: {
  state?: 'ready' | 'occupied' | 'unknown' | 'moved' | 'blocked'
}) {
  return (
    <svg
      viewBox="0 0 260 200"
      aria-hidden="true"
      focusable="false"
      className={`calendar-art art-${state}`}
    >
      <ellipse cx="130" cy="179" rx="94" ry="12" fill="#e3d9c7" />
      <path
        d="M49 50 Q48 38 62 37 L211 46 L201 171 Q200 179 185 179 L40 164 Z"
        fill="#d8b895"
      />
      <path
        d="M49 33 Q49 24 63 24 L198 32 Q211 33 210 46 L201 159 Q200 171 187 171 L49 161 Q37 160 39 147 Z"
        fill="#fffdf5"
        stroke="#354638"
        strokeWidth="3"
      />
      <path
        d="M49 33 Q49 24 63 24 L198 32 Q211 33 210 46 L208 67 L46 56 Z"
        fill={
          state === 'blocked' || state === 'occupied' ? '#eaa18c' : '#aec9a0'
        }
        stroke="#354638"
        strokeWidth="3"
      />
      <path
        d="M78 15 L76 40 M172 21 L170 46"
        stroke="#354638"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={61 + col * 33}
            y={79 + row * 25}
            width="18"
            height="13"
            rx="3"
            fill="#e9e8dd"
            transform="rotate(4 130 100)"
          />
        )),
      )}
      <circle
        cx="163"
        cy="125"
        r="34"
        fill={
          state === 'blocked' || state === 'occupied'
            ? '#b6533b'
            : state === 'unknown'
              ? '#ead399'
              : '#395d48'
        }
        stroke="#fffdf5"
        strokeWidth="4"
      />
      {state === 'unknown' ? (
        <path
          d="M153 115 C151 102 177 102 174 117 C173 124 162 123 162 133 M162 140 L162 141"
          stroke="#354638"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      ) : state === 'occupied' || state === 'blocked' ? (
        <path
          d="M151 114 L175 137 M175 114 L151 137"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M148 124 L159 135 L179 113"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <path
        d="M23 80 L17 70 M230 114 L241 110 M225 25 L231 18"
        stroke="#ba8750"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ClockArt({ hours, blocked }: { hours: number; blocked: boolean }) {
  return (
    <svg
      viewBox="0 0 260 200"
      aria-hidden="true"
      focusable="false"
      className="calendar-art"
    >
      <ellipse cx="129" cy="179" rx="71" ry="11" fill="#e3d9c7" />
      <circle
        cx="131"
        cy="97"
        r="70"
        fill={blocked ? '#f1bbaa' : '#ead399'}
        stroke="#354638"
        strokeWidth="3"
      />
      <circle
        cx="131"
        cy="97"
        r="56"
        fill="#fffdf5"
        stroke="#354638"
        strokeWidth="2"
      />
      <path
        d="M131 48 L131 55 M179 97 L172 97 M131 146 L131 139 M82 97 L89 97"
        stroke="#354638"
        strokeWidth="3"
      />
      <path
        d={hours < 24 ? 'M131 68 L131 97 L107 119' : 'M131 68 L131 97 L156 82'}
        stroke="#354638"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="131" cy="97" r="5" fill="#354638" />
      <path
        d="M83 158 L74 176 M178 158 L186 176 M44 50 L35 42 M216 61 L226 57"
        stroke="#354638"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BookingScene({ example }: { example: BookingCase }) {
  const blocked = example.outcome === 'blocked'
  const slotLabel =
    example.slot === 'free'
      ? 'Replacement slot is free'
      : example.slot === 'occupied'
        ? 'Replacement slot is occupied'
        : 'Slot availability unknown'
  return (
    <div className={`booking-scene outcome-${example.outcome}`}>
      <div className="scene-steps">
        <div className="scene-step">
          <span className="step-number">01 / THE BOOKING</span>
          <CalendarArt
            state={example.owner === 'other' ? 'blocked' : 'ready'}
          />
          <h2>
            {example.owner === 'you'
              ? 'Your confirmed booking'
              : 'Someone else’s booking'}
          </h2>
          <p>
            {example.owner === 'you'
              ? 'You are the customer'
              : 'Confirmed, but not owned by you'}
          </p>
        </div>
        <span className="scene-arrow" aria-hidden="true">
          ⤳
        </span>
        <div className="scene-step">
          <span className="step-number">02 / THE NOTICE</span>
          <ClockArt
            hours={example.hours}
            blocked={isBelowNoticeRequirement(example)}
          />
          <h2>{example.hours} hours remaining</h2>
          <p>Before the original start</p>
        </div>
        <span className="scene-arrow" aria-hidden="true">
          ⤳
        </span>
        <div className="scene-step">
          <span className="step-number">03 / THE NEW SLOT</span>
          <CalendarArt
            state={example.slot === 'free' ? 'moved' : example.slot}
          />
          <h2>{slotLabel}</h2>
          <p>
            {example.slot === 'unknown'
              ? 'This information is missing'
              : example.slot === 'occupied'
                ? 'Another booking is already here'
                : 'A new time is available'}
          </p>
        </div>
      </div>
      <div
        className="outcome-banner"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="outcome-symbol" aria-hidden="true">
          {example.outcome === 'allowed' ? '✓' : blocked ? '×' : '?'}
        </span>
        <div>
          <span className="outcome-label">Recorded example outcome</span>
          <h2>{example.result}</h2>
        </div>
        <p>
          {example.outcome === 'allowed'
            ? 'The booking moves to the free slot.'
            : blocked
              ? 'The original booking stays in place.'
              : 'No success or failure can be established.'}
        </p>
      </div>
    </div>
  )
}
