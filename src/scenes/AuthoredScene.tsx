import { authoredOutcomeLabels, type authoredView } from '../../shared/authored'
import { ClaimEvidence } from '../components/ClaimEvidence'
import { AtlasIcon } from '../components/AtlasIcon'

const conditionLabels = {
  met: 'Met',
  'not-met': 'Not met',
  unknown: 'Unknown',
  conflicting: 'Conflicting',
} as const

export function AuthoredScene({
  view,
}: {
  view: ReturnType<typeof authoredView>
}) {
  const selected = view.selected
  return (
    <div className="authored-scene">
      {selected ? (
        <>
          <div
            className="authored-outcome"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-outcome={selected.outcome.status}
          >
            <AtlasIcon
              name={
                selected.outcome.status === 'allowed'
                  ? 'check'
                  : selected.outcome.status === 'blocked'
                    ? 'close'
                    : 'warning'
              }
            />
            <p className="eyebrow">
              {authoredOutcomeLabels[selected.outcome.status]} · Recorded
              outcome
            </p>
            <h3>{selected.outcome.result}</h3>
            <p>{selected.outcome.reason ?? 'No reason has been recorded.'}</p>
          </div>
          <ClaimEvidence ids={selected.evidenceIds} />
          <h3>Conditions in this case</h3>
          {view.conditions.length ? (
            <ul className="authored-conditions">
              {view.conditions.map((c) => (
                <li key={c.ruleId}>
                  <strong>{c.rule.title}</strong>
                  <span
                    className="authored-condition-state"
                    data-state={c.state}
                  >
                    {conditionLabels[c.state]}
                  </span>
                  <p>{c.rule.statement}</p>
                  <ClaimEvidence ids={c.rule.evidenceIds} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No case conditions have been recorded.</p>
          )}
        </>
      ) : (
        <p>No saved cases have been recorded.</p>
      )}
      <h3>Recorded steps</h3>
      {view.steps.length ? (
        <ol className="authored-steps">
          {view.steps.map((step) => (
            <li key={step.id} data-step-id={step.id} data-active={step.active}>
              <div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <p className="authored-step-actors">
                  {step.actors.length
                    ? step.actors.map((a) => a.name).join(' · ')
                    : 'No step participants recorded.'}
                </p>
                {step.rules.length > 0 && (
                  <ul>
                    {step.rules.map((r) => (
                      <li key={r.id}>
                        <strong>{r.title}:</strong> {r.statement}
                        <ClaimEvidence ids={r.evidenceIds} />
                      </li>
                    ))}
                  </ul>
                )}
                {selected && (
                  <p className="revision-note">
                    {step.active
                      ? 'Included in this recorded case'
                      : 'Not included in this recorded case'}
                  </p>
                )}
                <ClaimEvidence ids={step.evidenceIds} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p>No ordered steps have been recorded.</p>
      )}
    </div>
  )
}
