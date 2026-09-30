import { expect, it } from 'vitest'
import { authoredSeed } from '../../fixtures/authored'
import { documentSchema } from '../../shared/contracts'
import { mapGroups, retainOrder, layoutNodes, visibleWorld } from './map-layout'
const project = documentSchema.parse({
  ...authoredSeed,
  revision: 1,
  assets: [],
})
it('groups by stable saved area identity and distinguishes same-titled areas', () => {
  const p = {
    ...project,
    areas: [...project.areas, { ...project.areas[0], id: 'other' }],
    features: [
      project.features[0],
      { ...project.features[0], id: 'second', areaId: 'other' },
    ],
  }
  expect(mapGroups(p).map((g) => [g.id, g.features.length])).toEqual([
    ['area:dispatch', 1],
    ['area:other', 1],
  ])
})
it('retains existing slots through additions, removals, renames and reordered input', () => {
  const first = retainOrder(['b', 'd'], [])
  const next = retainOrder(['a', 'd', 'b'], first)
  expect(next).toEqual(['b', 'd', 'a'])
  expect(retainOrder(['d', 'a'], next)).toEqual(['d', 'a'])
  const old = layoutNodes(first),
    updated = layoutNodes(next)
  expect(updated.nodes.find((n) => n.id === 'b')).toEqual(
    old.nodes.find((n) => n.id === 'b'),
  )
  const removed = layoutNodes(['d', 'a'], updated.nodes)
  expect(removed.nodes.find((n) => n.id === 'd')).toEqual(
    updated.nodes.find((n) => n.id === 'd'),
  )
  const tall = layoutNodes(['b', 'd', 'a', 'extra'], updated.nodes, 600)
  expect(tall.nodes.find((n) => n.id === 'extra')!.y).toBe(672)
  expect(tall.height).toBe(1304)
})
it('160 records have finite bounded derived coordinates and every identity remains reachable', () => {
  const result = layoutNodes(Array.from({ length: 160 }, (_, i) => String(i)))
  expect(result.nodes).toHaveLength(160)
  for (const n of result.nodes) {
    expect(n.x).toBeGreaterThanOrEqual(0)
    expect(n.y + result.nodeHeight).toBeLessThanOrEqual(result.height)
  }
  const view = visibleWorld(
    { positionX: -100, positionY: -50, scale: 0.5 },
    { width: 1000, height: 600 },
    { width: 2000, height: 1600 },
  )
  expect(view).toEqual({ x: 200, y: 100, width: 1800, height: 1200 })
})
