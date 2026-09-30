import { useParams } from 'react-router'
import {
  isApprovalFeature,
  isAuthoredFeature,
  isBookingFeature,
  isNavigationFeature,
} from '../../shared/contracts'
import { bookingView } from '../../shared/booking'
import { KnowledgeContext, useProject } from '../content/knowledge'
import { BookingPage } from './BookingPage'
import { NavigationPage } from './NavigationPage'
import { ApprovalPage } from './ApprovalPage'
import { AuthoredPage } from './AuthoredPage'
import { MissingPage } from './GuidePages'

export function FeaturePage() {
  const project = useProject()
  const { featureId } = useParams()
  const feature = project.features.find((f) => f.id === featureId)
  if (!feature) return <MissingPage />
  return isBookingFeature(feature) ? (
    <KnowledgeContext.Provider value={bookingView(feature)}>
      <BookingPage key={feature.id} />
    </KnowledgeContext.Provider>
  ) : isNavigationFeature(feature) ? (
    <NavigationPage key={feature.id} feature={feature} />
  ) : isAuthoredFeature(feature) ? (
    <AuthoredPage key={feature.id} feature={feature} />
  ) : isApprovalFeature(feature) ? (
    <ApprovalPage key={feature.id} feature={feature} />
  ) : (
    <MissingPage />
  )
}
