import { describe, expect, it } from 'vitest'
import { rememberPosition } from './navigationScrollMemory'

describe('navigation scroll memory', () => {
  it('caps remembered history and destination positions', () => {
    const historyPositions = new Map<string, number>()
    const destinationPositions = new Map<string, number>()

    for (let index = 0; index < 4; index += 1) {
      rememberPosition({
        historyPositions,
        destinationPositions,
        historyKey: `history-${index}`,
        destination: `/explore?case=${index}`,
        scrollY: index,
        limit: 3,
      })
    }

    expect([...historyPositions.keys()]).toEqual([
      'history-1',
      'history-2',
      'history-3',
    ])
    expect([...destinationPositions.keys()]).toEqual([
      '/explore?case=1',
      '/explore?case=2',
      '/explore?case=3',
    ])
  })

  it('keeps an updated existing key newer than older positions', () => {
    const historyPositions = new Map<string, number>()
    const destinationPositions = new Map<string, number>()

    for (let index = 0; index < 3; index += 1) {
      rememberPosition({
        historyPositions,
        destinationPositions,
        historyKey: `history-${index}`,
        destination: `/explore?case=${index}`,
        scrollY: index,
        limit: 3,
      })
    }

    rememberPosition({
      historyPositions,
      destinationPositions,
      historyKey: 'history-0',
      destination: '/explore?case=0',
      scrollY: 100,
      limit: 3,
    })
    rememberPosition({
      historyPositions,
      destinationPositions,
      historyKey: 'history-3',
      destination: '/explore?case=3',
      scrollY: 3,
      limit: 3,
    })

    expect([...historyPositions.keys()]).toEqual([
      'history-2',
      'history-0',
      'history-3',
    ])
    expect(historyPositions.get('history-0')).toBe(100)
    expect([...destinationPositions.keys()]).toEqual([
      '/explore?case=2',
      '/explore?case=0',
      '/explore?case=3',
    ])
    expect(destinationPositions.get('/explore?case=0')).toBe(100)
  })
})
