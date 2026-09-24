const POSITION_LIMIT = 50

function setCappedPosition(
  positions: Map<string, number>,
  key: string,
  scrollY: number,
  limit: number,
) {
  positions.delete(key)
  positions.set(key, scrollY)
  while (positions.size > limit) {
    const oldestKey = positions.keys().next().value
    if (oldestKey === undefined) return
    positions.delete(oldestKey)
  }
}

export function rememberPosition({
  historyPositions,
  destinationPositions,
  historyKey,
  destination,
  scrollY,
  limit = POSITION_LIMIT,
}: {
  historyPositions: Map<string, number>
  destinationPositions: Map<string, number>
  historyKey: string
  destination: string
  scrollY: number
  limit?: number
}) {
  setCappedPosition(historyPositions, historyKey, scrollY, limit)
  setCappedPosition(destinationPositions, destination, scrollY, limit)
}
