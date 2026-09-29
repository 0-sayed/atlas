import { AtlasIcon } from '../components/AtlasIcon'

/** Approved island scenery with the map symbol used for an empty workspace. */
export function DecorativeIsland({ withMap = false }: { withMap?: boolean }) {
  return (
    <span className="collection-island" aria-hidden="true">
      <img src="/art/penpot/island.png" alt="" />
      {withMap && <AtlasIcon name="map" />}
    </span>
  )
}
