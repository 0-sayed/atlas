import type { Camera, MapNode } from './map-layout'

type MapMemory = { camera?: Camera; order?: string[]; nodes?: MapNode[] }
const memories = new Map<string, MapMemory>()
const prefix = 'atlas-map-v1:'
export function readMapMemory(key: string): MapMemory {
  const cached = memories.get(key)
  if (cached) return cached
  try {
    const value = JSON.parse(
      sessionStorage.getItem(prefix + key) ?? '{}',
    ) as MapMemory
    if (
      value.camera &&
      (!Number.isFinite(value.camera.scale) ||
        value.camera.scale < 0.05 ||
        value.camera.scale > 2 ||
        !Number.isFinite(value.camera.positionX) ||
        !Number.isFinite(value.camera.positionY))
    )
      delete value.camera
    if (
      !Array.isArray(value.order) ||
      !value.order.every((id) => typeof id === 'string')
    )
      delete value.order
    if (
      !Array.isArray(value.nodes) ||
      !value.nodes.every(
        (n) =>
          typeof n.id === 'string' &&
          Number.isFinite(n.x) &&
          Number.isFinite(n.y) &&
          (n.slot === undefined ||
            (Number.isSafeInteger(n.slot) && n.slot >= 0)),
      )
    )
      delete value.nodes
    return value
  } catch {
    return {}
  }
}
export function saveMapMemory(key: string, value: MapMemory) {
  memories.delete(key)
  memories.set(key, value)
  while (memories.size > 100) memories.delete(memories.keys().next().value!)
  try {
    sessionStorage.setItem(prefix + key, JSON.stringify(value))
    const keys = Object.keys(sessionStorage).filter((k) => k.startsWith(prefix))
    while (keys.length > 100) sessionStorage.removeItem(keys.shift()!)
  } catch {
    /* In-memory restoration still works when browser storage is unavailable. */
  }
}
