import {
  isApprovalFeature,
  isBookingFeature,
  type Feature,
} from '../../shared/contracts'

export type AtlasIconName =
  | 'mountain'
  | 'map'
  | 'compass'
  | 'clock'
  | 'search'
  | 'book'
  | 'people'
  | 'box'
  | 'rule'
  | 'spark'
  | 'link'
  | 'warning'
  | 'check'
  | 'close'
  | 'target'
  | 'screen'
  | 'shield'

/** Decorative r227 vector master; its adjacent DOM label supplies meaning. */
export function AtlasIcon({ name }: { name: AtlasIconName }) {
  return (
    <img
      className="atlas-icon"
      src={`/art/penpot/${name}.svg`}
      alt=""
      aria-hidden="true"
      width="32"
      height="32"
    />
  )
}

const subjectIcon = {
  document: 'book',
  parcel: 'box',
  people: 'people',
  compass: 'compass',
  calendar: 'clock',
} as const

export function AtlasActivityIcon({ feature }: { feature: Feature }) {
  const illustration =
    feature.presentation?.illustration ??
    (isBookingFeature(feature)
      ? 'calendar'
      : isApprovalFeature(feature)
        ? 'document'
        : 'compass')
  return (
    <span
      className="activity-art atlas-activity-icon"
      data-illustration={illustration}
      data-accent={feature.presentation?.accent ?? 'sky'}
      aria-hidden="true"
    >
      <AtlasIcon name={subjectIcon[illustration]} />
    </span>
  )
}
