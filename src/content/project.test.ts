import { describe, expect, it } from 'vitest'
import { destinations } from './project'

describe('Atlas destinations', () => {
  it('provides stable, unique paths for current guide destinations', () => {
    expect(destinations.map(({ id, path }) => [id, path])).toEqual([
      ['start', '/'],
      ['map', '/map'],
      ['journeys', '/journeys'],
      ['actors', '/actors'],
      ['rules', '/rules'],
      ['glossary', '/glossary'],
    ])
    expect(new Set(destinations.map(({ path }) => path)).size).toBe(
      destinations.length,
    )
  })

  it('describes destinations without asserting fixture or source facts', () => {
    expect(
      destinations.every(({ description }) => description.trim().length > 0),
    ).toBe(true)
  })
})
