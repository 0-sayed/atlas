import { expect, it } from 'vitest'
import { resolve } from 'node:path'
import { dataDirectory } from './config.js'

it('rejects empty storage paths instead of writing into the repository root', () => {
  expect(() => dataDirectory('')).toThrow('must not be empty')
  expect(() => dataDirectory('   ')).toThrow('must not be empty')
  expect(dataDirectory('.local')).toBe(resolve('.local'))
})
