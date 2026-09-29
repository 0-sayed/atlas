import {
  isApprovalFeature,
  isBookingFeature,
  type Feature,
} from '../../shared/contracts'
import { AtlasActivityIcon } from '../components/AtlasIcon'

/** Saved presentation controls the subject and accent on approved r227 scenery. */
export function ActivitySubject({ feature }: { feature: Feature }) {
  return <AtlasActivityIcon feature={feature} />
}

export function ActivityArt({ feature }: { feature: Feature }) {
  const illustration =
    feature.presentation?.illustration ??
    (isBookingFeature(feature)
      ? 'calendar'
      : isApprovalFeature(feature)
        ? 'document'
        : 'compass')
  const accent = feature.presentation?.accent ?? 'sky'
  return (
    <div
      className="activity-art activity-island"
      data-illustration={illustration}
      data-accent={accent}
      aria-hidden="true"
    >
      <img
        className="activity-island-scenery"
        src="/art/penpot/island.png"
        alt=""
      />
      <AtlasActivityIcon feature={feature} />
    </div>
  )
}
