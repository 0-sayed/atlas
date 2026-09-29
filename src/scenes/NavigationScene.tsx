import type { NavigationCase } from '../../shared/contracts'
import { AtlasIcon } from '../components/AtlasIcon'

export function NavigationScene({ example }: { example: NavigationCase }) {
  return (
    <div
      className="navigation-scene"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-outcome={example.outcome}
    >
      <div className="navigation-step navigation-start">
        <span className="navigation-step-number">1</span>
        <AtlasIcon name="screen" />
        <p className="eyebrow">Starting point</p>
        <p>{example.start}</p>
      </div>
      <div className="navigation-step navigation-action">
        <span className="navigation-step-number">2</span>
        <AtlasIcon name="target" />
        <p className="eyebrow">Action</p>
        <p>{example.action}</p>
      </div>
      <div className="navigation-step navigation-result">
        <span className="navigation-step-number">3</span>
        <AtlasIcon
          name={
            example.outcome === 'available'
              ? 'check'
              : example.outcome === 'unavailable'
                ? 'close'
                : 'warning'
          }
        />
        <p className="eyebrow">
          {example.outcome === 'available'
            ? 'Available'
            : example.outcome === 'unavailable'
              ? 'Unavailable'
              : 'Unknown'}
        </p>
        <h2>{example.result}</h2>
        <p>{example.reason}</p>
      </div>
    </div>
  )
}
