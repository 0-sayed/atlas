export type Destination = {
  id: 'start' | 'explore'
  path: '/' | '/explore'
  label: string
  description: string
  state: 'fixture'
}

export const destinations: readonly Destination[] = [
  {
    id: 'start',
    path: '/',
    label: 'Start here',
    description: 'A place to begin exploring a product through visual stories.',
    state: 'fixture',
  },
  {
    id: 'explore',
    path: '/explore',
    label: 'Explore',
    description:
      'Explore the illustrative booking activity and its saved cases.',
    state: 'fixture',
  },
]
