import { expect, it } from 'vitest'
import { approvalFeature, approvalSeed } from '../fixtures/approval.js'
import { seed } from '../fixtures/booking.js'
import { approvalOutcome } from './approval.js'
import { featureSchema, validateDocument } from './contracts.js'
import { Store } from '../server/store.js'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

it('derives approvals from the current rule without inventing unknown counts', () => {
  const example = approvalFeature.cases[0]
  expect(approvalOutcome(approvalFeature, example).outcome).toBe('allowed')
  expect(
    approvalOutcome({ ...approvalFeature, requiredApprovals: 2 }, example)
      .outcome,
  ).toBe('blocked')
  expect(
    approvalOutcome(approvalFeature, { ...example, approvals: null }).outcome,
  ).toBe('unknown')
  expect(
    approvalOutcome(approvalFeature, { ...example, role: 'requester' }).outcome,
  ).toBe('blocked')
  expect(
    approvalOutcome(approvalFeature, { ...example, state: 'closed' }).outcome,
  ).toBe('blocked')
})

it('accepts old booking data and rejects mixed or unsupported scenes', () => {
  expect(
    validateDocument({ ...seed, revision: 1, assets: [] }).features,
  ).toHaveLength(1)
  expect(featureSchema.safeParse(approvalFeature).success).toBe(true)
  expect(
    featureSchema.safeParse({ ...approvalFeature, noticeHours: 24 }).success,
  ).toBe(false)
  expect(
    featureSchema.safeParse({ ...approvalFeature, requiredApprovals: 0 })
      .success,
  ).toBe(false)
  expect(
    featureSchema.safeParse({
      ...approvalFeature,
      scene: { kind: 'approval', version: 2 },
    }).success,
  ).toBe(false)
})

it('persists distinct scenes, scoped overlapping IDs and immutable approval history', () => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-approval-'))
  let store = new Store(dir)
  try {
    store.create(seed)
    const created = store.create(approvalSeed)
    store.apply(created.id, {
      contractVersion: 1,
      expectedRevision: 1,
      upsertFeatures: [{ ...approvalFeature, requiredApprovals: 2 }],
    })
    store.close()
    store = new Store(dir)
    expect(store.read(created.id).features[0]).toMatchObject({
      requiredApprovals: 2,
    })
    expect(store.history(created.id)[0].features[0]).toMatchObject({
      requiredApprovals: 1,
    })
    expect(store.read(seed.id)).toMatchObject({
      revision: 1,
      features: seed.features,
    })
  } finally {
    store.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
