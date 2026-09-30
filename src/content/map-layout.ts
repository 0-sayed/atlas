import type { ProjectDocument, Feature } from '../../shared/contracts'
import { featureGroup } from '../../shared/exploration'

export type MapGroup = {
  id: string
  title: string
  features: Feature[]
  evidenceIds: string[]
}
export function mapGroups(project: ProjectDocument) {
  const groups = new Map<string, MapGroup>()
  for (const feature of project.features) {
    const area = project.areas.find((a) => a.id === feature.areaId)
    const title = featureGroup(project, feature)
    const id = area ? 'area:' + area.id : 'group:' + title
    const group = groups.get(id) ?? {
      id,
      title,
      features: [],
      evidenceIds: area?.evidenceIds ?? [],
    }
    group.features.push(feature)
    groups.set(id, group)
  }
  return [...groups.values()].sort((a, b) => a.id.localeCompare(b.id))
}
export function retainOrder(ids: string[], previous: string[]) {
  const active = new Set(ids),
    known = new Set(previous)
  return [
    ...previous.filter((id) => active.has(id)),
    ...ids.filter((id) => !known.has(id)).sort(),
  ]
}
export type MapNode = { id: string; x: number; y: number; slot?: number }
export function layoutNodes(
  ids: string[],
  previous: MapNode[] = [],
  nodeHeight = 340,
) {
  const nodeWidth = 280,
    columns = 3
  const old = new Map(previous.map((n) => [n.id, n]))
  const used = new Set(
    ids.flatMap((id) => {
      const n = old.get(id)
      return n
        ? [n.slot ?? ((n.y - 32) / 380) * columns + (n.x - 32) / 320]
        : []
    }),
  )
  let next = 0
  const nodes = ids.map((id) => {
    const existing = old.get(id)
    while (!existing && used.has(next)) next++
    const slot = existing
      ? (existing.slot ??
        ((existing.y - 32) / 380) * columns + (existing.x - 32) / 320)
      : next++
    used.add(slot)
    return {
      id,
      slot,
      x: 32 + (slot % columns) * 320,
      y: 32 + Math.floor(slot / columns) * (nodeHeight + 40),
    }
  })
  return {
    nodes,
    nodeWidth,
    nodeHeight,
    width: Math.max(344, ...nodes.map((n) => n.x + nodeWidth + 32)),
    height: Math.max(404, ...nodes.map((n) => n.y + nodeHeight + 32)),
  }
}
export type Camera = { positionX: number; positionY: number; scale: number }
export function visibleWorld(
  camera: Camera,
  viewport: { width: number; height: number },
  world: { width: number; height: number },
) {
  const left = -camera.positionX / camera.scale,
    top = -camera.positionY / camera.scale
  const x = Math.max(0, Math.min(world.width, left)),
    y = Math.max(0, Math.min(world.height, top))
  return {
    x,
    y,
    width: Math.max(
      0,
      Math.min(world.width, left + viewport.width / camera.scale) - x,
    ),
    height: Math.max(
      0,
      Math.min(world.height, top + viewport.height / camera.scale) - y,
    ),
  }
}
