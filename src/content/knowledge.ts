import { createContext, useContext } from 'react'
import { bookingView } from '../../shared/booking'
import type { ProjectDocument } from '../../shared/contracts'
export const ProjectContext = createContext<ProjectDocument | null>(null)
export function useProject() {
  const value = useContext(ProjectContext)
  if (!value) throw new Error('Project provider required')
  return value
}
export function projectPath(id: string) {
  return `/projects/${id}`
}
export const KnowledgeContext = createContext<ReturnType<
  typeof bookingView
> | null>(null)
export function useBooking() {
  const value = useContext(KnowledgeContext)
  if (!value) throw new Error('Knowledge provider required')
  return value
}
