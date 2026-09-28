import {
  isApprovalFeature,
  isBookingFeature,
  type Feature,
  type Presentation,
} from '../../shared/contracts'

function defaultIllustration(feature: Feature): Presentation['illustration'] {
  return isBookingFeature(feature)
    ? 'calendar'
    : isApprovalFeature(feature)
      ? 'document'
      : 'compass'
}

function Subject({
  illustration,
}: {
  illustration: Presentation['illustration']
}) {
  switch (illustration) {
    case 'calendar':
      return (
        <g>
          <rect
            x="114"
            y="67"
            width="132"
            height="116"
            rx="13"
            fill="#253f56"
          />
          <rect x="120" y="72" width="120" height="105" rx="9" fill="#fffdf6" />
          <path d="M120 86q0-14 12-14h96q12 0 12 14v17H120Z" fill="#f2a783" />
          <path
            d="M149 66v20m61-20v20"
            stroke="#253f56"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M141 122h18m23 0h18m22 0h-1m-80 23h18m23 0h18m22 0h-1"
            stroke="#bfd7da"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx="211"
            cy="146"
            r="19"
            fill="#60b59c"
            stroke="#253f56"
            strokeWidth="3"
          />
          <path
            d="m202 146 6 6 12-14"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )
    case 'document':
      return (
        <g>
          <path d="M127 57h84l29 28v100H127Z" fill="#263f58" />
          <path d="M132 62h75l27 26v91H132Z" fill="#fffdf6" />
          <path
            d="M207 62v27h27"
            fill="#cce6e3"
            stroke="#263f58"
            strokeWidth="3"
          />
          <path
            d="M150 106h63m-63 17h63m-63 17h43"
            stroke="#9dbbc2"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            cx="213"
            cy="148"
            r="25"
            fill="#f2ab7f"
            stroke="#263f58"
            strokeWidth="3"
          />
          <path
            d="m201 148 8 8 17-19"
            fill="none"
            stroke="#263f58"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )
    case 'compass':
      return (
        <g>
          <circle cx="180" cy="119" r="68" fill="#263f58" />
          <circle cx="180" cy="119" r="60" fill="#fffdf6" />
          <circle
            cx="180"
            cy="119"
            r="49"
            fill="#dceef0"
            stroke="#8dbabc"
            strokeWidth="2"
          />
          <path
            d="m180 76 8 35 35 8-35 8-8 35-8-35-35-8 35-8Z"
            fill="#f5b987"
            stroke="#263f58"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="m180 76 8 35-8 8-8-8Z" fill="#ed866e" />
          <circle cx="180" cy="119" r="8" fill="#263f58" />
          <path
            d="M180 44v-8m0 166v-8m-83-75h-8m182 0h-8"
            stroke="#263f58"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      )
    case 'parcel':
      return (
        <g>
          <path
            d="m111 95 69-32 69 32-69 34Z"
            fill="#f6c494"
            stroke="#263f58"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="m111 95 69 34v68l-69-34Z"
            fill="#de925f"
            stroke="#263f58"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="m249 95-69 34v68l69-34Z"
            fill="#efaf79"
            stroke="#263f58"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="m144 80 71 33v31l-16-4v-20l-71-32"
            fill="#fff2d2"
            stroke="#263f58"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="m180 129 69-34" stroke="#263f58" strokeWidth="2" />
          <path
            d="m131 133 20 10m-20 0 12 6"
            stroke="#ffe3bb"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      )
    case 'people':
      return (
        <g>
          <circle cx="149" cy="99" r="28" fill="#263f58" />
          <circle cx="149" cy="96" r="23" fill="#f5c49d" />
          <path
            d="M128 89q1-29 24-25 20 2 22 27-9-15-18-14-10 17-28 12"
            fill="#394557"
          />
          <path
            d="M103 174q1-47 46-47t47 47"
            fill="#ef9c81"
            stroke="#263f58"
            strokeWidth="4"
          />
          <circle cx="213" cy="99" r="25" fill="#263f58" />
          <circle cx="213" cy="99" r="20" fill="#d29b70" />
          <path
            d="M194 93q-2-23 19-23 19 0 20 21-17-4-23-15-3 10-16 17"
            fill="#263f58"
          />
          <path
            d="M182 174q3-43 32-43 35 0 43 43"
            fill="#67b59f"
            stroke="#263f58"
            strokeWidth="4"
          />
          <path
            d="M139 105h2m16 0h2m-16 9q7 7 14 0m50-9h2m12 0h2m-14 9q6 5 12 0"
            stroke="#263f58"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )
  }
}

export function ActivitySubject({ feature }: { feature: Feature }) {
  const illustration =
    feature.presentation?.illustration ?? defaultIllustration(feature)
  const accent = feature.presentation?.accent ?? 'sky'
  return (
    <div
      className={`activity-art art-${accent}`}
      data-illustration={illustration}
      data-accent={accent}
      aria-hidden="true"
    >
      <svg viewBox="0 0 360 244" focusable="false">
        <Subject illustration={illustration} />
      </svg>
    </div>
  )
}

export function ActivityArt({ feature }: { feature: Feature }) {
  const illustration =
    feature.presentation?.illustration ?? defaultIllustration(feature)
  const accent = feature.presentation?.accent ?? 'sky'
  return (
    <div
      className={`activity-art art-${accent}`}
      data-illustration={illustration}
      data-accent={accent}
      aria-hidden="true"
    >
      <svg viewBox="0 0 360 244" focusable="false">
        <ellipse
          cx="180"
          cy="212"
          rx="145"
          ry="23"
          fill="#436d80"
          opacity=".12"
        />
        <path
          d="M39 186q35-23 69-8 27-20 64-11 38-22 75-8 51-12 74 26l-9 18q-33 23-89 24H128q-62-2-80-22Z"
          fill="#426779"
        />
        <path
          d="M39 181q35-23 69-8 27-20 64-11 38-22 75-8 51-12 74 26l-9 14q-47 23-105 25h-72q-68-4-87-25Z"
          fill="#d8b995"
        />
        <path
          d="M39 176q35-23 69-8 27-20 64-11 38-22 75-8 51-12 74 26-17 19-76 28-101 15-178-7-23-7-28-20Z"
          fill="var(--art-ground)"
          stroke="#4d796a"
          strokeWidth="2"
        />
        <path
          d="M56 182q27 9 55 4m160 3q19-1 32-9"
          stroke="#a6d687"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="m58 151 12-39 13 39Z"
          fill="#357d70"
          stroke="#315d63"
          strokeWidth="2"
        />
        <path d="m62 133 8-27 10 27Z" fill="#419786" />
        <path
          d="M69 151v15m235-26 11-32 11 32Zm4-15 7-25 8 25Z"
          fill="#439985"
          stroke="#315d63"
          strokeWidth="2"
        />
        <path d="M315 141v22" stroke="#315d63" strokeWidth="3" />
        <path
          d="m51 83 8-18 8 18m-5-8 7-16 9 18"
          fill="none"
          stroke="var(--art-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m285 61 5-11 5 11m-5-6 9-11 6 14"
          fill="none"
          stroke="var(--art-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="180"
          cy="186"
          rx="82"
          ry="13"
          fill="#536b57"
          opacity=".16"
        />
        <Subject illustration={illustration} />
        <path
          d="m92 163 3-9 3 9m185-6 3-9 3 9"
          stroke="#4e8c72"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="88" cy="171" r="3" fill="#efab86" />
        <circle cx="102" cy="183" r="3" fill="#fff3cd" />
        <circle cx="272" cy="170" r="3" fill="#efab86" />
        <path
          d="m106 49 3-8m8 13 8-2m-24 8-7 3m176 55 5-8m8 12 8 1"
          stroke="var(--art-accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
