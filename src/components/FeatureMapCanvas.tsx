import { useEffect, useRef, useState, useMemo } from 'react'
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import type { Feature, ProjectDocument } from '../../shared/contracts'
import { AtlasActivityIcon, AtlasIcon } from './AtlasIcon'
import { layoutNodes, visibleWorld, type Camera } from '../content/map-layout'
import { readMapMemory, saveMapMemory } from '../content/map-memory'

export type CanvasItem = {
  id: string
  title: string
  feature?: Feature
  count?: number
}
export function FeatureMapCanvas({
  items,
  project,
  selected,
  onSelect,
  memoryKey,
}: {
  items: CanvasItem[]
  project: ProjectDocument
  selected: string | null
  onSelect: (id: string) => void
  memoryKey: string
}) {
  const [saved] = useState(() => readMapMemory(memoryKey))
  const [nodeHeight, setNodeHeight] = useState(340)
  const layout = useMemo(
    () =>
      layoutNodes(
        items.map((i) => i.id),
        saved.nodes,
        nodeHeight,
      ),
    [items, saved.nodes, nodeHeight],
  )
  const [camera, setCamera] = useState<Camera>(
    saved.camera ?? { positionX: 0, positionY: 0, scale: 1 },
  )
  const [size, setSize] = useState({ width: 1, height: 600 })
  const initialized = useRef(false)
  const ref = useRef<ReactZoomPanPinchRef>(null)
  const region = useRef<HTMLDivElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const pointer = useRef<{
    id: number
    x: number
    y: number
    dragged: boolean
  } | null>(null)
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const height = Math.max(
        340,
        ...[
          ...world.current!.querySelectorAll<HTMLButtonElement>('.map-node'),
        ].map((n) => n.offsetHeight),
      )
      setNodeHeight(height)
    })
    world
      .current!.querySelectorAll('.map-node')
      .forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (size.width <= 1 || initialized.current) return
    if (saved.camera) {
      const changed =
        saved.nodes &&
        (saved.nodes.length !== layout.nodes.length ||
          layout.nodes.some(
            (node) =>
              !saved.nodes!.some(
                (old) =>
                  old.id === node.id && old.x === node.x && old.y === node.y,
              ),
          ))
      const view = visibleWorld(saved.camera, size, layout)
      const visible =
        view.width > 0 &&
        view.height > 0 &&
        layout.nodes.some(
          (node) =>
            node.x < view.x + view.width &&
            node.x + layout.nodeWidth > view.x &&
            node.y < view.y + view.height &&
            node.y + layout.nodeHeight > view.y,
        )
      // Preserve intentional panning unless changed islands leave empty water.
      if (!changed || visible) return
    }
    const frame = requestAnimationFrame(() => {
      initialized.current = true
      void ref.current?.fitToView({ animationTime: 0, maxScale: 1 })
    })
    return () => cancelAnimationFrame(frame)
  }, [layout, saved, size])
  useEffect(() => {
    const el = region.current!
    const observer = new ResizeObserver(() =>
      setSize({ width: el.clientWidth, height: el.clientHeight }),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const viewport = visibleWorld(camera, size, layout)
  const points = new Map(layout.nodes.map((n) => [n.id, n]))
  const edges = selected
    ? project.relations.filter(
        (r) =>
          (r.from === selected || r.to === selected) &&
          points.has(r.from) &&
          points.has(r.to),
      )
    : []
  const transform = (next: Camera) => {
    setCamera(next)
    const current = readMapMemory(memoryKey)
    saveMapMemory(memoryKey, { ...current, nodes: layout.nodes, camera: next })
  }
  const ensureVisible = (el: HTMLButtonElement) => {
    const controls = ref.current!
    const { scale, positionX, positionY } = controls.instance.state
    // DOM transforms can lag behind the live camera during React updates.
    const left = positionX + el.offsetLeft * scale
    const top = positionY + el.offsetTop * scale
    if (
      left < 0 ||
      left + el.offsetWidth * scale > size.width ||
      top < 0 ||
      top + el.offsetHeight * scale > size.height
    ) {
      const nextScale = Math.min(
        1,
        size.width / el.offsetWidth,
        size.height / el.offsetHeight,
      )
      void controls.setTransform(
        size.width / 2 - (el.offsetLeft + el.offsetWidth / 2) * nextScale,
        size.height / 2 - (el.offsetTop + el.offsetHeight / 2) * nextScale,
        nextScale,
        0,
      )
    }
  }
  return (
    <div className="map-canvas-section">
      <p id="map-instructions" className="revision-note">
        Select an island to explore. Drag the water to pan; focus the map and
        use arrow keys, + or − to move and zoom. Ctrl + wheel also zooms.
      </p>
      <TransformWrapper
        ref={ref}
        initialScale={saved.camera?.scale ?? 1}
        initialPositionX={saved.camera?.positionX ?? 0}
        initialPositionY={saved.camera?.positionY ?? 0}
        fitOnInit={!saved.camera}
        minScale={0.05}
        maxScale={2}
        limitToBounds={false}
        panning={{ excluded: ['button', 'a'], velocityDisabled: true }}
        wheel={{ activationKeys: ['Control'], step: 0.1 }}
        doubleClick={{ disabled: true }}
        zoomAnimation={{ disabled: true }}
        velocityAnimation={{ disabled: true }}
        autoAlignment={{ disabled: true }}
        onTransform={(_, next) => transform(next)}
      >
        <div
          ref={region}
          className="map-camera"
          role="region"
          aria-label="Interactive feature map"
          aria-describedby="map-instructions"
          tabIndex={0}
          data-camera={JSON.stringify(camera)}
          data-world={JSON.stringify({
            width: layout.width,
            height: layout.height,
          })}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return
            const actions: Record<string, () => void> = {
              ArrowLeft: () => {
                void ref.current?.panBy(80, 0, 0)
              },
              ArrowRight: () => {
                void ref.current?.panBy(-80, 0, 0)
              },
              ArrowUp: () => {
                void ref.current?.panBy(0, 80, 0)
              },
              ArrowDown: () => {
                void ref.current?.panBy(0, -80, 0)
              },
              '+': () => {
                void ref.current?.zoomIn(0.2, 0)
              },
              '=': () => {
                void ref.current?.zoomIn(0.2, 0)
              },
              '-': () => {
                void ref.current?.zoomOut(0.2, 0)
              },
              Home: () => {
                void ref.current?.fitToView({ animationTime: 0, maxScale: 1 })
              },
            }
            if (actions[e.key]) {
              e.preventDefault()
              actions[e.key]()
            }
          }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%', overflow: 'clip' }}
            contentStyle={{ width: layout.width, height: layout.height }}
          >
            <div
              ref={world}
              className="map-world"
              style={{ width: layout.width, height: layout.height }}
            >
              <svg
                className="map-relationship-layer"
                width={layout.width}
                height={layout.height}
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="map-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                  </marker>
                </defs>
                {edges.map((edge) => {
                  const from = points.get(edge.from)!,
                    to = points.get(edge.to)!
                  return (
                    <line
                      key={edge.id}
                      data-kind={edge.kind}
                      x1={from.x + layout.nodeWidth / 2}
                      y1={from.y + layout.nodeHeight / 2}
                      x2={to.x + layout.nodeWidth / 2}
                      y2={to.y + layout.nodeHeight / 2}
                      markerEnd={
                        edge.kind === 'related' ? undefined : 'url(#map-arrow)'
                      }
                    />
                  )
                })}
              </svg>
              {layout.nodes.map((node) => {
                const item = items.find((i) => i.id === node.id)!
                return (
                  <button
                    key={node.id}
                    className="map-node"
                    type="button"
                    aria-label={
                      item.feature ? item.title : 'Open ' + item.title
                    }
                    aria-pressed={
                      item.feature ? selected === item.id : undefined
                    }
                    data-node-id={item.id}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: layout.nodeWidth,
                      minHeight: layout.nodeHeight,
                    }}
                    onFocus={(e) => ensureVisible(e.currentTarget)}
                    onPointerDown={(e) => {
                      pointer.current = {
                        id: e.pointerId,
                        x: e.clientX,
                        y: e.clientY,
                        dragged: false,
                      }
                      e.currentTarget.setPointerCapture(e.pointerId)
                    }}
                    onPointerMove={(e) => {
                      const start = pointer.current
                      if (
                        start?.id === e.pointerId &&
                        Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6
                      )
                        start.dragged = true
                    }}
                    onPointerCancel={() => {
                      pointer.current = null
                    }}
                    onClick={(e) => {
                      const dragged = pointer.current?.dragged
                      pointer.current = null
                      if (e.detail === 0 || !dragged) onSelect(item.id)
                    }}
                  >
                    <span className="map-scenery" aria-hidden="true">
                      <img src="/art/penpot/island.png" alt="" />
                      {item.feature ? (
                        <AtlasActivityIcon feature={item.feature} />
                      ) : (
                        <AtlasIcon name="map" />
                      )}
                    </span>
                    <span className="map-node-title">{item.title}</span>
                    <span className="map-node-meta">
                      {item.count !== undefined
                        ? `${item.count} recorded ${item.count === 1 ? 'activity' : 'activities'}`
                        : item.feature?.evidence.status === 'demo'
                          ? 'Illustrative fixture'
                          : item.feature?.evidence.status === 'uncertain'
                            ? 'Uncertain evidence'
                            : 'Source-supported'}
                    </span>
                  </button>
                )
              })}
            </div>
          </TransformComponent>
        </div>
        <div className="map-camera-controls">
          <div className="map-zoom-controls">
            <button
              className="atlas-button"
              aria-label="Zoom out"
              onClick={() => {
                void ref.current?.zoomOut(0.2, 0)
              }}
            >
              −
            </button>
            <output aria-label="Map zoom">
              {Math.round(camera.scale * 100)}%
            </output>
            <button
              className="atlas-button"
              aria-label="Zoom in"
              onClick={() => {
                void ref.current?.zoomIn(0.2, 0)
              }}
            >
              +
            </button>
            <button
              className="atlas-button"
              onClick={() => {
                void ref.current?.fitToView({ animationTime: 0, maxScale: 1 })
              }}
            >
              Fit all islands
            </button>
          </div>
          <button
            className="map-minimap"
            type="button"
            aria-label="Map overview: move viewport"
            onClick={(e) => {
              const box = e.currentTarget
                .querySelector('svg')!
                .getBoundingClientRect()
              const x = Math.max(
                  0,
                  Math.min(
                    layout.width,
                    ((e.clientX - box.left) / box.width) * layout.width,
                  ),
                ),
                y = Math.max(
                  0,
                  Math.min(
                    layout.height,
                    ((e.clientY - box.top) / box.height) * layout.height,
                  ),
                )
              void ref.current?.setTransform(
                size.width / 2 - x * camera.scale,
                size.height / 2 - y * camera.scale,
                camera.scale,
                0,
              )
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                void ref.current?.fitToView({ animationTime: 0, maxScale: 1 })
              }
            }}
          >
            <span>Map overview</span>
            <svg
              viewBox={'0 0 ' + layout.width + ' ' + layout.height}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {layout.nodes.map((n) => (
                <rect
                  key={n.id}
                  x={n.x}
                  y={n.y}
                  width={layout.nodeWidth}
                  height={layout.nodeHeight}
                  className="map-minimap-node"
                />
              ))}
              <rect
                className="map-minimap-viewport"
                x={viewport.x}
                y={viewport.y}
                width={viewport.width}
                height={viewport.height}
              />
            </svg>
          </button>
        </div>
      </TransformWrapper>
    </div>
  )
}
