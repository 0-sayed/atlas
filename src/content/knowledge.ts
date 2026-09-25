import { createContext, useContext } from 'react'
import { bookingView } from '../../shared/booking'
export const KnowledgeContext = createContext<ReturnType<
  typeof bookingView
> | null>(null)
export function useBooking() {
  const value = useContext(KnowledgeContext)
  if (!value) throw new Error('Knowledge provider required')
  return value
}
