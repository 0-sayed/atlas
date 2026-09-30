import { afterEach, expect, it, vi } from 'vitest'
import { readMapMemory } from './map-memory'
import { layoutNodes } from './map-layout'
afterEach(() => vi.unstubAllGlobals())
it('ignores invalid persisted slots while accepting current and legacy coordinates', () => {
  for (const slot of ['bad', -1, 0.5, null]) {
    vi.stubGlobal('sessionStorage', {
      getItem: () =>
        JSON.stringify({ nodes: [{ id: 'island', x: 32, y: 32, slot }] }),
    })
    const memory = readMapMemory('invalid-slot-' + slot)
    expect(memory.nodes).toBeUndefined()
    const layout = layoutNodes(['island'], memory.nodes)
    expect(
      layout.nodes.every(
        (node) => Number.isFinite(node.x) && Number.isFinite(node.y),
      ),
    ).toBe(true)
  }
  for (const node of [
    { id: 'island', x: 32, y: 32 },
    { id: 'island', x: 32, y: 32, slot: 0 },
  ]) {
    vi.stubGlobal('sessionStorage', {
      getItem: () => JSON.stringify({ nodes: [node] }),
    })
    expect(readMapMemory('valid-slot-' + ('slot' in node)).nodes).toEqual([
      node,
    ])
  }
})
