import { describe, expect, it } from 'vitest'
import { destinations } from './project'

describe('Atlas foundation destinations', () => {
  it('provides stable, unique paths for the three promised destinations', () => {
    expect(destinations.map(({ id, path }) => [id, path])).toEqual([
      ['start', '/'],
      ['explore', '/explore'],
      ['changes', '/changes'],
    ])
    expect(new Set(destinations.map(({ path }) => path)).size).toBe(
      destinations.length,
    )
  })

  it('does not present the unbuilt guide as verified product knowledge', () => {
    expect(destinations.every(({ state }) => state === 'foundation')).toBe(true)
    expect(
      destinations.every(({ description }) => description.trim().length > 0),
    ).toBe(true)
  })
})
