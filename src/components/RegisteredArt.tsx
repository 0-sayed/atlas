import { useState } from 'react'
export function RegisteredArt({
  projectId,
  assetId,
  title,
}: {
  projectId: string
  assetId: string
  title: string
}) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="registered-art">
      {failed ? (
        <figcaption>Illustration unavailable</figcaption>
      ) : (
        <img
          src={`/api/v1/projects/${encodeURIComponent(projectId)}/assets/${encodeURIComponent(assetId)}`}
          alt={`${title} illustration`}
          onError={() => setFailed(true)}
        />
      )}
    </figure>
  )
}
