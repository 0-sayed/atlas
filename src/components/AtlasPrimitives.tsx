import type { ReactNode } from 'react'

export function AtlasBadge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'available' | 'unavailable' | 'unknown'
}) {
  return <span className={`atlas-badge atlas-badge-${tone}`}>{children}</span>
}

export function AtlasPanel({
  id,
  title,
  description,
  icon,
  tone,
  className = '',
  children,
}: {
  id: string
  title: string
  description?: string
  icon: ReactNode
  tone: 'info' | 'success' | 'warning' | 'related'
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={`atlas-panel atlas-panel-${tone} ${className}`}
      aria-labelledby={id}
    >
      <div className="atlas-panel-heading">
        <span className="atlas-panel-icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h2 id={id} tabIndex={-1}>
            {title}
          </h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
