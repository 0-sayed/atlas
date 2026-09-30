/* global URL, fetch, AbortSignal, Buffer, process */
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const recordBatches = {
  evidenceRecords: ['upsertEvidenceRecords', 'removeEvidenceRecordIds'],
  actors: ['upsertActors', 'removeActorIds'],
  rules: ['upsertRules', 'removeRuleIds'],
  areas: ['upsertAreas', 'removeAreaIds'],
  journeys: ['upsertJourneys', 'removeJourneyIds'],
  glossary: ['upsertGlossary', 'removeGlossaryIds'],
}
const fail = (message) => {
  throw new Error(message)
}

/** Read-only capability/limit preflight. No write token, source checkout or Atlas imports. */
export async function preflight(baseUrl, payload, projectId) {
  const base = new URL(baseUrl)
  if (
    base.protocol !== 'http:' ||
    !['127.0.0.1', 'localhost'].includes(base.hostname) ||
    base.username ||
    base.password ||
    base.pathname !== '/' ||
    base.search ||
    base.hash
  )
    fail('Select an explicit local http loopback Atlas base URL')
  const get = (path) =>
    fetch(new URL(`/api/v1${path}`, base), {
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    })
  const response = await get('/capabilities')
  if (!response.ok)
    fail(
      'Unsupported target: read-only capabilities unavailable; stop before writes',
    )
  const caps = await response.json()
  if (
    caps.capabilitiesVersion !== 1 ||
    !Array.isArray(caps.writeContractVersions) ||
    !Array.isArray(caps.scenes) ||
    !Array.isArray(caps.records) ||
    !caps.visual ||
    !caps.limits
  )
    fail('Unsupported capabilities response version or shape')
  if (!caps.writeContractVersions.includes(payload.contractVersion))
    fail('Unsupported write contract version')
  const size = Buffer.byteLength(JSON.stringify(payload))
  if (size > caps.limits.requestBytes)
    fail('Payload exceeds bounded request bytes')
  const batch = (values, max, name) => {
    if (values !== undefined && (!Array.isArray(values) || values.length > max))
      fail(`${name} exceeds advertised batch limit`)
  }
  const features = payload.features ?? payload.upsertFeatures ?? []
  batch(features, caps.limits.writeFeatures, 'Features')
  batch(payload.removeFeatureIds, caps.limits.writeFeatures, 'Feature removals')
  batch(
    payload.relations ?? payload.upsertRelations,
    caps.limits.writeRelations,
    'Relations',
  )
  batch(
    payload.removeRelationIds,
    caps.limits.writeRelations,
    'Relation removals',
  )
  const hasBindings = features.some((f) =>
    ['actorIds', 'ruleIds', 'evidenceIds', 'areaId'].some((key) => key in f),
  )
  if (
    payload.contractVersion !== 2 &&
    (hasBindings ||
      [
        'purpose',
        ...Object.keys(recordBatches),
        ...Object.values(recordBatches).flat(),
      ].some((key) => key in payload))
  )
    fail('Unsupported knowledge records/bindings in legacy write contract')
  for (const feature of features) {
    const scene = caps.scenes.find((s) => s.kind === feature.scene?.kind)
    if (
      !scene?.versions.includes(feature.scene?.version) ||
      !scene.contractVersions?.includes(payload.contractVersion)
    )
      fail('Unsupported scene kind, version or write contract')
    if (
      feature.presentation &&
      (!caps.visual.presentation ||
        !caps.visual.illustrations.includes(
          feature.presentation.illustration,
        ) ||
        !caps.visual.accents.includes(feature.presentation.accent))
    )
      fail('Unsupported visual capability')
    if (feature.assetIds?.length && !caps.visual.registeredRasterAssets)
      fail('Unsupported registered raster assets')
  }
  for (const relation of payload.relations ?? payload.upsertRelations ?? []) {
    if (
      !caps.relationshipKinds?.includes(relation.kind) ||
      (payload.contractVersion === 1 &&
        !['requires', 'related'].includes(relation.kind))
    )
      fail('Unsupported relationship meaning')
  }
  if ('purpose' in payload && !caps.records.includes('purpose'))
    fail('Unsupported project purpose')
  for (const [key, [upsert, remove]] of Object.entries(recordBatches)) {
    if (
      [key, upsert, remove].some((k) => k in payload) &&
      !caps.records.includes(key)
    )
      fail(`Unsupported ${key} records`)
    batch(payload[key] ?? payload[upsert], caps.limits.writeRecords, key)
    batch(payload[remove], caps.limits.writeRecords, `${key} removals`)
  }
  const id = projectId ?? payload.id
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id ?? ''))
    fail('Select an explicit valid target project ID')
  const currentResponse = await get(`/projects/${id}`)
  let current
  if (projectId) {
    if (!currentResponse.ok)
      fail(`Selected project unavailable (${currentResponse.status})`)
    current = await currentResponse.json()
    if (
      current.contractVersion !== caps.readContractVersion ||
      current.id !== id
    )
      fail('Unsupported current document contract or identity')
    if (payload.expectedRevision !== current.revision)
      fail('Unsupported stale revision; reread and deliberately rebase')
  } else if (currentResponse.status !== 404)
    fail('New project identity is occupied or cannot be checked')
  const count = (old = [], added = [], removed = []) =>
    new Set(
      [...old.filter((i) => !removed.includes(i.id)), ...added].map(
        (i) => i.id,
      ),
    ).size
  if (
    count(current?.features, features, payload.removeFeatureIds) >
    caps.limits.projectFeatures
  )
    fail('Project exceeds total feature capacity')
  if (
    count(
      current?.relations,
      payload.relations ?? payload.upsertRelations,
      payload.removeRelationIds,
    ) > caps.limits.projectRelations
  )
    fail('Project exceeds total relationship capacity')
  for (const [key, [upsert, remove]] of Object.entries(recordBatches)) {
    if (
      count(current?.[key], payload[key] ?? payload[upsert], payload[remove]) >
      (key === 'evidenceRecords'
        ? caps.limits.projectEvidence
        : caps.limits.projectRecords)
    )
      fail(`Project exceeds total ${key} capacity`)
  }
  const merge = (old = [], added = [], removed = []) => {
    const records = new Map(old.map((item) => [item.id, item]))
    for (const id of removed) records.delete(id)
    for (const item of added) records.set(item.id, item)
    return [...records.values()]
  }
  const projected = {
    ...(current ?? { id, assets: [] }),
    contractVersion: caps.readContractVersion,
    title: payload.title ?? current?.title,
    revision: (current?.revision ?? 0) + 1,
    features: merge(current?.features, features, payload.removeFeatureIds),
    relations: merge(
      current?.relations,
      payload.relations ?? payload.upsertRelations,
      payload.removeRelationIds,
    ),
  }
  for (const [key, [upsert, remove]] of Object.entries(recordBatches))
    projected[key] = merge(
      current?.[key],
      payload[key] ?? payload[upsert],
      payload[remove],
    )
  if ('purpose' in payload) {
    if (payload.purpose === null) delete projected.purpose
    else projected.purpose = payload.purpose
  }
  // Match the advertised compatibility bound for exact legacy-only records.
  const legacyOnly =
    !projected.purpose &&
    Object.keys(recordBatches).every((key) => projected[key].length === 0) &&
    projected.features.length <= 100 &&
    projected.relations.length <= 200 &&
    projected.features.every(
      (feature) =>
        feature.scene.kind !== 'authored' &&
        !['actorIds', 'ruleIds', 'areaId', 'evidenceIds'].some(
          (key) => key in feature,
        ) &&
        Buffer.byteLength(JSON.stringify(feature)) <= caps.limits.requestBytes,
    ) &&
    projected.relations.every(
      (relation) =>
        ['requires', 'related'].includes(relation.kind) &&
        !relation.evidenceIds,
    )
  const documentBytes = Buffer.byteLength(JSON.stringify(projected))
  const documentLimit = legacyOnly
    ? (caps.limits.legacyDocumentBytes ?? caps.limits.documentBytes)
    : caps.limits.documentBytes
  if (documentBytes > documentLimit)
    fail('Projected current document exceeds advertised document bytes')
  return {
    fit: 'supported',
    contractVersion: payload.contractVersion,
    target: projectId ? 'existing-project' : 'new-project',
    projectId: id,
    ...(current
      ? {
          revision: current.revision,
          currentDocumentBytes: Buffer.byteLength(JSON.stringify(current)),
        }
      : {}),
    payloadBytes: size,
    projectedDocumentBytes: documentBytes,
    documentByteLimit: documentLimit,
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    if (process.argv.length < 4 || process.argv.length > 5)
      fail(
        'Usage: node preflight.mjs <local-base-url> <payload.json> [existing-project-id]',
      )
    const result = await preflight(
      process.argv[2],
      JSON.parse(readFileSync(process.argv[3], 'utf8')),
      process.argv[4],
    )
    process.stdout.write(`${JSON.stringify(result)}\n`)
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : 'Preflight failed'}\n`,
    )
    process.exitCode = 1
  }
}
