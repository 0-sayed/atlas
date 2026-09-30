import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { mapGroups, retainOrder } from '../content/map-layout'
import { readMapMemory, saveMapMemory } from '../content/map-memory'
import { featureHref } from '../content/destinations'
import { useProject } from '../content/knowledge'
import { searchFeatures } from '../../shared/exploration'
import { relationshipLabel } from '../../shared/relationships'
import {
  FeatureMapCanvas,
  type CanvasItem,
} from '../components/FeatureMapCanvas'
import { AtlasActivityIcon, AtlasIcon } from '../components/AtlasIcon'
import { ClaimEvidence } from '../components/ClaimEvidence'
import { FixtureLabel } from './GuidePages'
import { DecorativeIsland } from './DecorativeIsland'
import './feature-map.css'

export function FeatureMapPage() {
  const project = useProject()
  const [params, setParams] = useSearchParams()
  const groups = useMemo(() => mapGroups(project), [project])
  const groupId = params.get('group') ?? '',
    query = params.get('q') ?? '',
    selected = params.get('selected')
  const group = groups.find((g) => g.id === groupId)
  const list = params.get('view') === 'list'
  const page = Number(params.get('page') ?? '1')
  const filtered = searchFeatures(project, query).filter(
    (f) => !groupId || group?.features.some((x) => x.id === f.id),
  )
  const overview = !groupId && !query.trim()
  const items: CanvasItem[] = overview
    ? groups.map((g) => ({
        id: g.id,
        title: g.title,
        count: g.features.length,
      }))
    : filtered.map((feature) => ({
        id: feature.id,
        title: feature.title,
        feature,
      }))
  const scope = JSON.stringify([project.id, groupId, query])
  const orderKey = scope + ':order'
  const order = retainOrder(
    items.map((i) => i.id),
    readMapMemory(orderKey).order ?? [],
  )
  const ordered = order.map((id) => items.find((i) => i.id === id)!)
  const pages = Math.max(1, Math.ceil(items.length / 6))
  const currentItems = ordered.slice((page - 1) * 6, page * 6)
  const memoryKey = scope + ':' + page
  const selectedFeature = selected
    ? filtered.find((f) => f.id === selected)
    : undefined
  const preview = useRef<HTMLElement>(null)
  useEffect(() => {
    saveMapMemory(orderKey, { order })
  }, [orderKey, order])
  const update = (changes: Record<string, string | null>, replace = false) => {
    // Hash history can advance before React commits the preceding interaction.
    const next = new URLSearchParams(
      window.location.hash.split('?').slice(1).join('?'),
    )
    for (const [key, value] of Object.entries(changes))
      if (value) next.set(key, value)
      else next.delete(key)
    setParams(next, { replace })
  }
  const openFeature = (featureId: string, caseId?: string) =>
    featureHref(project.id, featureId, 'map', params, caseId)
  const invalid = !!(
    (groupId && !group) ||
    (selected && !selectedFeature) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > pages
  )
  const relations = selectedFeature
    ? project.relations.filter(
        (r) => r.from === selectedFeature.id || r.to === selectedFeature.id,
      )
    : []
  return (
    <section className="feature-map-page" aria-labelledby="page-title">
      <FixtureLabel />
      <h1 id="page-title">Feature Map</h1>
      <p className="intro">
        {project.features.length} activities · {groups.length} groups
      </p>
      <div className="map-toolbar">
        <form
          role="search"
          className="search-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="map-search">Search activities</label>
          <div className="search-row">
            <AtlasIcon name="search" />
            <input
              id="map-search"
              type="search"
              placeholder="Find an activity, actor, condition or area"
              value={query}
              onChange={(e) =>
                update({ q: e.target.value, page: null, selected: null }, true)
              }
            />
          </div>
        </form>
        <label className="map-group-filter">
          Area
          <select
            aria-label="Area"
            value={groupId}
            onChange={(e) =>
              update({ group: e.target.value, page: null, selected: null })
            }
          >
            <option value="">All areas</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </label>
        <button
          className="atlas-button"
          type="button"
          aria-pressed={list}
          onClick={() => update({ view: list ? null : 'list' })}
        >
          {list ? 'Map view' : 'List view'}
        </button>
      </div>
      {(query || groupId || selected || page !== 1) && (
        <button
          className="atlas-button map-reset"
          type="button"
          onClick={() => setParams(list ? { view: 'list' } : {})}
        >
          Return to all areas
        </button>
      )}
      {group && (
        <>
          <h2 className="map-area-title">{group.title}</h2>
          <ClaimEvidence ids={group.evidenceIds} />
        </>
      )}
      {invalid ? (
        <div className="knowledge-empty">
          <DecorativeIsland />
          <h2>This map location is unavailable.</h2>
          <p>The saved activity, area or page is absent in this project.</p>
        </div>
      ) : !project.features.length ? (
        <div className="knowledge-empty">
          <DecorativeIsland />
          <h2>No activities recorded yet.</h2>
          <p>
            This map does not establish product behavior until reviewed
            activities are incorporated.
          </p>
        </div>
      ) : !filtered.length ? (
        <div className="knowledge-empty">
          <DecorativeIsland />
          <h2>No matching activities.</h2>
          <p>Try another search or return to all areas.</p>
        </div>
      ) : (
        <>
          {list ? (
            <div className="map-list" aria-label="Recorded activities">
              {filtered.map((feature) => (
                <Link
                  className="map-list-item"
                  aria-label={feature.title}
                  key={feature.id}
                  to={openFeature(feature.id, feature.cases[0]?.id)}
                >
                  <AtlasActivityIcon feature={feature} />
                  <div>
                    <h2>{feature.title}</h2>
                    <p>{feature.purpose}</p>
                    <span className="revision-note">
                      {feature.evidence.status === 'demo'
                        ? 'Illustrative fixture'
                        : feature.evidence.status === 'uncertain'
                          ? 'Uncertain evidence'
                          : 'Source-supported'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <>
              <div className="map-page-controls">
                <button
                  className="atlas-button"
                  aria-label="Previous map page"
                  disabled={page === 1}
                  onClick={() =>
                    update({
                      page: page === 2 ? null : String(page - 1),
                      selected: null,
                    })
                  }
                >
                  Previous
                </button>
                <span>
                  Page {page} of {pages} · {items.length}{' '}
                  {overview ? 'groups' : 'activities'}
                </span>
                <button
                  className="atlas-button"
                  aria-label="Next map page"
                  disabled={page === pages}
                  onClick={() =>
                    update({ page: String(page + 1), selected: null })
                  }
                >
                  Next
                </button>
              </div>
              <FeatureMapCanvas
                key={memoryKey + currentItems.map((i) => i.id).join('|')}
                project={project}
                items={currentItems}
                selected={selected}
                memoryKey={memoryKey}
                onSelect={(id) => {
                  if (overview)
                    update({ group: id, page: null, selected: null })
                  else {
                    update({ selected: id })
                    requestAnimationFrame(() =>
                      preview.current?.scrollIntoView({
                        block: 'start',
                        behavior: 'instant',
                      }),
                    )
                  }
                }}
              />
              <p className="revision-note">
                Groups and counts come from saved knowledge. Open an area to
                reveal its activities. Only the selected activity’s saved
                connections are drawn; all its connections are listed below.
              </p>
            </>
          )}
          {selectedFeature && (
            <section
              ref={preview}
              className="map-feature-preview"
              aria-labelledby="map-feature-title"
            >
              <h2 id="map-feature-title">{selectedFeature.title}</h2>
              <p>{selectedFeature.purpose}</p>
              {selectedFeature.evidenceIds ? (
                <ClaimEvidence ids={selectedFeature.evidenceIds} />
              ) : (
                <p className="revision-note">
                  {selectedFeature.evidence.description}
                </p>
              )}
              <Link
                className="atlas-button"
                to={openFeature(
                  selectedFeature.id,
                  selectedFeature.cases[0]?.id,
                )}
              >
                Open activity
              </Link>
              <h3>Recorded connections</h3>
              {relations.length ? (
                <ul>
                  {relations.map((relation) => {
                    const outgoing = relation.from === selectedFeature.id
                    const other = project.features.find(
                      (f) => f.id === (outgoing ? relation.to : relation.from),
                    )!
                    return (
                      <li key={relation.id}>
                        <strong>
                          {relationshipLabel(relation.kind, outgoing)}:
                        </strong>{' '}
                        <Link to={openFeature(other.id)}>{other.title}</Link>
                        {relation.evidenceIds ? (
                          <ClaimEvidence ids={relation.evidenceIds} />
                        ) : (
                          <p className="revision-note">
                            No relationship-specific evidence has been recorded.
                          </p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p>No relationships have been recorded for this activity.</p>
              )}
            </section>
          )}
        </>
      )}
    </section>
  )
}
