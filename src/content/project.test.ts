import { describe, expect, it } from 'vitest'
import { destinations } from './project'

describe('Atlas destinations', () => {
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

  it('labels guide destinations as fixture content, not verified product knowledge', () => {
    expect(destinations.every(({ state }) => state === 'fixture')).toBe(true)
    expect(
      destinations.every(({ description }) => description.trim().length > 0),
    ).toBe(true)
  })
})
