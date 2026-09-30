import { expect, it } from 'vitest'
import { relationshipLabel } from './relationships'
it('keeps directed recorded relationship meanings in both directions', () => {
  expect(relationshipLabel('requires', true)).toBe('Requires')
  expect(relationshipLabel('requires', false)).toBe('Required by')
  expect(relationshipLabel('blocks', true)).toBe('Blocks')
  expect(relationshipLabel('blocks', false)).toBe('Blocked by')
  expect(relationshipLabel('triggers', true)).toBe('Triggers')
  expect(relationshipLabel('triggers', false)).toBe('Triggered by')
  expect(relationshipLabel('related', false)).toBe('Related to')
})
