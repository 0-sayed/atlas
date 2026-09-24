export type Destination = {
  id: 'start' | 'explore' | 'changes'
  path: '/' | '/explore' | '/changes'
  label: string
  description: string
  state: 'foundation'
}

export const destinations: readonly Destination[] = [
  {
    id: 'start',
    path: '/',
    label: 'Start here',
    description: 'A place to begin exploring a product through visual stories.',
    state: 'foundation',
  },
  {
    id: 'explore',
    path: '/explore',
    label: 'Explore',
    description:
      'Illustrated activities and cases will appear here as they are built.',
    state: 'foundation',
  },
  {
    id: 'changes',
    path: '/changes',
    label: 'What changed',
    description: 'Reviewed before-and-after explanations will appear here.',
    state: 'foundation',
  },
]
