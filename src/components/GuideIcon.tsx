type GuideIconName = 'projects' | 'start' | 'explore' | 'changes' | 'search'

export function GuideIcon({ name }: { name: GuideIconName }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'projects' && (
        <>
          <rect x="4" y="5" width="9" height="9" rx="2" fill="#daf0ff" />
          <rect x="19" y="5" width="9" height="9" rx="2" fill="#fff0c9" />
          <rect x="4" y="20" width="9" height="9" rx="2" fill="#d9f4e7" />
          <rect x="19" y="20" width="9" height="9" rx="2" fill="#e8e0ff" />
        </>
      )}
      {name === 'start' && (
        <>
          <path d="m3 7 9-4 9 4 8-4v23l-8 4-9-4-9 4Z" fill="#d7f0ff" />
          <path d="M12 3v23m9-19v23" />
          <path d="m5 19 4-3m6-3 3 2m6 3 2-3" stroke="#479b95" />
        </>
      )}
      {name === 'explore' && (
        <>
          <circle cx="16" cy="16" r="13" fill="#edf7ff" />
          <path d="m22 9-4 10-9 4 4-10Z" fill="#8dcbd9" />
          <path d="m13 13 5 6" />
          <circle cx="16" cy="16" r="1" fill="currentColor" />
        </>
      )}
      {name === 'changes' && (
        <>
          <circle cx="16" cy="16" r="13" fill="#eff6ff" />
          <path d="M16 7v10h7M7 6l-3 4" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="13" cy="13" r="9" fill="#d6f2ff" />
          <path d="m20 20 8 8M8 13a5 5 0 0 1 5-5" />
        </>
      )}
    </svg>
  )
}
