import type { AtlasIconName } from '../components/AtlasIcon'
export type DestinationId =
  'start' | 'map' | 'journeys' | 'actors' | 'rules' | 'glossary'
export type Destination = {
  id: DestinationId
  path: string
  label: string
  description: string
  icon: AtlasIconName
}
export const destinations: readonly Destination[] = [
  {
    id: 'start',
    path: '/',
    label: 'Start here',
    description: 'What this project lets people accomplish.',
    icon: 'map',
  },
  {
    id: 'map',
    path: '/map',
    label: 'Feature Map',
    description: 'Recorded activities and their relationships.',
    icon: 'compass',
  },
  {
    id: 'journeys',
    path: '/journeys',
    label: 'User Journeys',
    description: 'Authored paths towards a recorded goal.',
    icon: 'link',
  },
  {
    id: 'actors',
    path: '/actors',
    label: 'Actors',
    description: 'Recorded roles and explicit participation.',
    icon: 'people',
  },
  {
    id: 'rules',
    path: '/rules',
    label: 'Rules',
    description: 'Conditions that explain recorded behavior.',
    icon: 'rule',
  },
  {
    id: 'glossary',
    path: '/glossary',
    label: 'Glossary',
    description: 'Saved product terms and their meanings.',
    icon: 'book',
  },
]
