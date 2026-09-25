import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { bookingView } from '../../shared/booking'
import { approvalOutcome } from '../../shared/approval'
import {
  featureChanges,
  historyForRevision,
  relationChanges,
  type FeatureChange,
} from '../../shared/changes'
import { isBookingFeature, type ProjectDocument } from '../../shared/contracts'
import { KnowledgeContext, projectPath, useProject } from '../content/knowledge'
import { FixtureLabel } from './GuidePages'
import { BookingComparison } from './BookingComparison'
import { HistoricalFeature } from '../components/HistoricalFeature'

function RuleDifference({ change }: { change: FeatureChange }) {
  const { before, after } = change
  if (!before || !after) return null
  if (
    isBookingFeature(before) &&
    isBookingFeature(after) &&
    before.noticeHours !== after.noticeHours
  )
    return (
      <p className="rule-difference">
        {before.noticeHours} → {after.noticeHours} hours’ notice
      </p>
    )
  if (
    !isBookingFeature(before) &&
    !isBookingFeature(after) &&
    before.requiredApprovals !== after.requiredApprovals
  ) {
    const example = after.cases.find((c) =>
      before.cases.some((old) => JSON.stringify(old) === JSON.stringify(c)),
    )
    return (
      <>
        <p className="rule-difference">
          {before.requiredApprovals} → {after.requiredApprovals} independent
          approvals
        </p>
        {example && (
          <div className="change-example">
            <p>Same saved case: {example.label}</p>
            <p>
              {approvalOutcome(before, example).result} →{' '}
              {approvalOutcome(after, example).result}
            </p>
          </div>
        )}
      </>
    )
  }
  return null
}
function SavedChanges() {
  const project = useProject()
  const [history, setHistory] = useState<ProjectDocument[] | null>(null)
  const [error, setError] = useState('')
  const [request, setRequest] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(`/api/v1/projects/${project.id}/history`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Unavailable history')
        const snapshots = historyForRevision(await response.json(), project)
        if (!controller.signal.aborted) {
          setHistory(snapshots)
          setError('')
        }
      } catch {
        if (!controller.signal.aborted)
          setError(
            'Saved history unavailable. The current guide is still available.',
          )
      }
    }
    void load()
    return () => controller.abort()
  }, [project, request])
  if (error)
    return (
      <div role="alert">
        <p>{error}</p>
        <button
          onClick={() => {
            setError('')
            setRequest((n) => n + 1)
          }}
        >
          Retry history
        </button>
      </div>
    )
  if (!history) return <p role="status">Loading saved history…</p>
  const entries = history
    .flatMap((snapshot, index) =>
      index === 0
        ? []
        : featureChanges(history[index - 1], snapshot).map((change) => ({
            change,
            revision: snapshot.revision,
            beforeRevision: history[index - 1].revision,
          })),
    )
    .reverse()
  const relations = history
    .flatMap((snapshot, index) =>
      index === 0
        ? []
        : relationChanges(history[index - 1], snapshot).map((change) => ({
            change,
            revision: snapshot.revision,
            beforeRevision: history[index - 1].revision,
          })),
    )
    .reverse()
  return (
    <div className="saved-changes">
      <h2>Saved guide changes</h2>
      <p className="revision-note">
        Historical knowledge snapshots through Atlas revision {project.revision}
        . These are not production releases.
      </p>
      {entries.length === 0 && relations.length === 0 && (
        <p>No recorded behavior changes between saved revisions.</p>
      )}
      {entries.map(({ change, revision, beforeRevision }) => (
        <article className="saved-change" key={`${revision}-${change.id}`}>
          <p className="eyebrow">
            Atlas revision {beforeRevision} → {revision} · Historical
          </p>
          <h3>{(change.after ?? change.before)!.title}</h3>
          <p className="change-kind">
            {change.kind === 'removed'
              ? 'Removed from this guide'
              : change.kind === 'added'
                ? 'Added to this guide'
                : 'Recorded behavior changed'}
          </p>
          <RuleDifference change={change} />
          <div
            className={change.before && change.after ? 'comparison-grid' : ''}
          >
            {change.before && (
              <HistoricalFeature
                feature={change.before}
                label={`Before · Atlas revision ${beforeRevision}`}
              />
            )}
            {change.after && (
              <HistoricalFeature
                feature={change.after}
                label={`After · Atlas revision ${revision}`}
              />
            )}
          </div>
          <p className="revision-note">
            {(change.after ?? change.before)!.evidence.status === 'demo'
              ? 'Illustrative fixture'
              : (change.after ?? change.before)!.evidence.status === 'uncertain'
                ? 'Uncertain evidence'
                : 'Source-supported'}{' '}
            · {(change.after ?? change.before)!.evidence.sourceRevision}
          </p>
          {project.features.some((f) => f.id === change.id) && (
            <Link
              className="text-link"
              to={`${projectPath(project.id)}/explore/${change.id}?from=changes`}
            >
              Explore current activity ↗
            </Link>
          )}
        </article>
      ))}
      {relations.map(({ change, revision, beforeRevision }) => (
        <article
          className="saved-change"
          key={`${revision}-${change.kind}-${change.relation.id}`}
        >
          <p className="eyebrow">
            Atlas revision {beforeRevision} → {revision} · Historical
          </p>
          <h3>
            {change.kind === 'added'
              ? 'Added relationship'
              : 'Removed relationship'}
          </h3>
          <p>
            {change.fromTitle}{' '}
            {change.relation.kind === 'requires' ? 'requires' : 'is related to'}{' '}
            {change.toTitle}
          </p>
        </article>
      ))}
    </div>
  )
}
export function ChangesPage() {
  const project = useProject()
  return (
    <section className="changes-page" aria-labelledby="page-title">
      <FixtureLabel />
      <h1 id="page-title">What changed</h1>
      {project.features.filter(isBookingFeature).map((feature) => (
        <KnowledgeContext.Provider
          key={feature.id}
          value={bookingView(feature)}
        >
          <BookingComparison />
        </KnowledgeContext.Provider>
      ))}
      <SavedChanges key={`${project.id}:${project.revision}`} />
    </section>
  )
}
