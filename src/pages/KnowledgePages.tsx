import { Link, useSearchParams } from 'react-router'
import { isAuthoredFeature } from '../../shared/contracts'
import { authoredOutcomeLabels } from '../../shared/authored'
import {
  actorParticipation,
  ruleContext,
  featureHref,
} from '../content/destinations'
import { destinations, type DestinationId } from '../content/project'
import { useProject, projectPath } from '../content/knowledge'
import { AtlasIcon, AtlasActivityIcon } from '../components/AtlasIcon'
import { AtlasPanel } from '../components/AtlasPrimitives'
import { ClaimEvidence } from '../components/ClaimEvidence'
import { useSearchInput } from '../components/useSearchInput'
import { FixtureLabel } from './GuidePages'
import { DecorativeIsland } from './DecorativeIsland'
import './knowledge-pages.css'

export type KnowledgeDestination = Exclude<DestinationId, 'start' | 'map'>
export function KnowledgePage({
  destination,
}: {
  destination: KnowledgeDestination
}) {
  const project = useProject()
  const [params, setParams] = useSearchParams()
  const info = destinations.find((d) => d.id === destination)!
  const query = params.get('q') ?? ''
  const search = useSearchInput(query)
  const selected = params.get('item')
  const records = project[destination]
  const name = (record: (typeof records)[number]) =>
    'name' in record
      ? record.name
      : 'term' in record
        ? record.term
        : record.title
  const words = query.trim().toLocaleLowerCase().split(/\s+/)
  const matches = records.filter((r) =>
    words.every((w) =>
      [
        name(r),
        'description' in r
          ? r.description
          : 'statement' in r
            ? r.statement
            : 'goal' in r
              ? r.goal
              : 'definition' in r
                ? r.definition
                : '',
      ]
        .join(' ')
        .toLocaleLowerCase()
        .includes(w),
    ),
  )
  const scoped = selected ? records.filter((r) => r.id === selected) : matches
  const href = (featureId: string, caseId?: string, item?: string) => {
    const p = new URLSearchParams(params)
    if (item) p.set('item', item)
    return featureHref(project.id, featureId, destination, p, caseId)
  }
  const select = (id: string) => {
    const p = new URLSearchParams(params)
    p.set('item', id)
    return '?' + p
  }
  const clear = () => {
    const p = new URLSearchParams(params)
    p.delete('q')
    p.delete('item')
    setParams(p, { replace: true })
  }
  return (
    <section className="knowledge-page" aria-labelledby="page-title">
      <FixtureLabel />
      <header className="knowledge-hero">
        <div>
          <h1 id="page-title">{info.label}</h1>
          <p className="intro">{info.description}</p>
        </div>
        <img src="/art/penpot/panorama.png" alt="" aria-hidden="true" />
      </header>
      <form
        role="search"
        className="search-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="record-search">Search {info.label}</label>
        <div className="search-row">
          <AtlasIcon name="search" />
          <input
            ref={search}
            id="record-search"
            type="search"
            defaultValue={query}
            placeholder="Find a saved record"
            onChange={(e) => {
              const p = new URLSearchParams(params)
              p.delete('item')
              if (e.target.value) p.set('q', e.target.value)
              else p.delete('q')
              setParams(p, { replace: true })
            }}
          />
        </div>
      </form>
      {(query || selected) && (
        <button className="atlas-button" type="button" onClick={clear}>
          {selected && !query ? `Show all ${info.label}` : 'Clear search'}
        </button>
      )}
      {selected && scoped.length === 0 ? (
        <div className="knowledge-empty">
          <DecorativeIsland />
          <h2>This record is unavailable</h2>
          <p>This link has no matching saved record in this project.</p>
          <button className="atlas-button" onClick={clear}>
            Return to {info.label}
          </button>
        </div>
      ) : !records.length ? (
        <div className="knowledge-empty">
          <DecorativeIsland />
          <h2>No saved records yet.</h2>
          <p>
            No {info.label.toLowerCase()} have been recorded for this project.
            Activity summaries do not establish these facts.
          </p>
        </div>
      ) : !scoped.length ? (
        <div className="knowledge-empty">
          <DecorativeIsland />
          <h2>No matching records.</h2>
          <p>Try another saved name or clear your search.</p>
        </div>
      ) : (
        <>
          <p className="revision-note">
            {(query.trim() || selected) && `${scoped.length} of `}
            {records.length} saved {records.length === 1 ? 'record' : 'records'}
          </p>
          <div className={'knowledge-layout knowledge-layout-' + destination}>
            {(destination === 'rules' || destination === 'journeys') && (
              <aside
                className="knowledge-index"
                aria-label={info.label + ' index'}
              >
                <h2>
                  {info.label === 'Rules' ? 'Product rules' : 'Saved journeys'}
                </h2>
                {records
                  .filter((r) => matches.includes(r) || r.id === selected)
                  .map((r) => (
                    <Link
                      key={r.id}
                      to={select(r.id)}
                      aria-current={selected === r.id ? 'true' : undefined}
                    >
                      {name(r)}
                    </Link>
                  ))}
              </aside>
            )}
            <div className="knowledge-records">
              {scoped.map((record) => (
                <AtlasPanel
                  key={record.id}
                  id={'record-' + record.id}
                  title={name(record)}
                  icon={<AtlasIcon name={info.icon} />}
                  tone={destination === 'rules' ? 'success' : 'info'}
                  className="knowledge-record"
                >
                  {'name' in record ? (
                    <>
                      {record.description ? (
                        <p>{record.description}</p>
                      ) : (
                        <p className="revision-note">
                          No role description has been recorded.
                        </p>
                      )}
                      <h3>Participates in</h3>
                      {actorParticipation(project, record.id).length ? (
                        <ul>
                          {actorParticipation(project, record.id).map(
                            ({ feature, steps }) => (
                              <li key={feature.id}>
                                <Link to={href(feature.id)}>
                                  {feature.title}
                                </Link>
                                {steps.length > 0 && (
                                  <ul>
                                    {steps.map((s) => (
                                      <li key={s.id}>{s.title}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p>No explicit participation has been recorded.</p>
                      )}
                    </>
                  ) : 'statement' in record ? (
                    <>
                      <p className="knowledge-statement">{record.statement}</p>
                      <h3>See the rule in context</h3>
                      {ruleContext(project, record.id).length ? (
                        ruleContext(project, record.id).map(
                          ({ feature, steps, cases }) => (
                            <div key={feature.id} className="knowledge-context">
                              <Link to={href(feature.id, undefined, record.id)}>
                                {feature.title}
                              </Link>
                              {steps.length > 0 && (
                                <p>
                                  Recorded steps:{' '}
                                  {steps.map((s) => s.title).join(' · ')}
                                </p>
                              )}
                              {cases.length > 0 ? (
                                <details className="knowledge-case-details">
                                  <summary>
                                    {cases.length} saved{' '}
                                    {cases.length === 1 ? 'case' : 'cases'}
                                  </summary>
                                  <ul>
                                    {cases.map((c) => (
                                      <li key={c.id}>
                                        <Link
                                          to={href(feature.id, c.id, record.id)}
                                        >
                                          {c.label} ·{' '}
                                          {
                                            authoredOutcomeLabels[
                                              c.outcome.status
                                            ]
                                          }
                                        </Link>
                                        <p>
                                          Condition:{' '}
                                          {c.conditions
                                            .find(
                                              (x) => x.ruleId === record.id,
                                            )!
                                            .state.replace('-', ' ')}
                                        </p>
                                        <ClaimEvidence ids={c.evidenceIds} />
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              ) : isAuthoredFeature(feature) ? (
                                <p>No saved cases reference this rule.</p>
                              ) : null}
                            </div>
                          ),
                        )
                      ) : (
                        <p>No activities reference this rule.</p>
                      )}
                    </>
                  ) : 'goal' in record ? (
                    <>
                      <p className="knowledge-statement">{record.goal}</p>
                      <ol className="journey-path">
                        {record.steps.map((step, index) => {
                          const feature = project.features.find(
                            (f) => f.id === step.featureId,
                          )!
                          const savedStep = isAuthoredFeature(feature)
                            ? feature.steps.find((s) => s.id === step.stepId)
                            : undefined
                          return (
                            <li className="journey-step" key={index}>
                              <span
                                className="journey-scenery"
                                aria-hidden="true"
                              >
                                <img src="/art/penpot/island.png" alt="" />
                                <AtlasActivityIcon feature={feature} />
                              </span>
                              <span
                                className="journey-number"
                                aria-hidden="true"
                              >
                                {index + 1}
                              </span>
                              <div>
                                <Link
                                  to={href(feature.id, undefined, record.id)}
                                >
                                  {feature.title}
                                </Link>
                                {savedStep && (
                                  <>
                                    <h3>{savedStep.title}</h3>
                                    <p>{savedStep.description}</p>
                                    <ClaimEvidence
                                      ids={savedStep.evidenceIds}
                                    />
                                  </>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ol>
                    </>
                  ) : (
                    <>
                      <p className="knowledge-statement">{record.definition}</p>
                      <h3>See it in context</h3>
                      {record.featureIds.length + record.ruleIds.length ? (
                        <ul>
                          {record.featureIds.map((id) => (
                            <li key={'feature-' + id}>
                              <Link to={href(id)}>
                                {
                                  project.features.find((f) => f.id === id)!
                                    .title
                                }
                              </Link>
                            </li>
                          ))}
                          {record.ruleIds.map((id) => (
                            <li key={'rule-' + id}>
                              <Link
                                to={
                                  projectPath(project.id) +
                                  '/rules?' +
                                  new URLSearchParams({ item: id })
                                }
                              >
                                {project.rules.find((r) => r.id === id)!.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No context links have been recorded.</p>
                      )}
                    </>
                  )}
                  <ClaimEvidence ids={record.evidenceIds} />
                </AtlasPanel>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
