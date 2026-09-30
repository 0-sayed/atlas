import { limits } from './limits.js'
import { presentationSchema } from './contract-fields.js'

export const capabilities = {
  capabilitiesVersion: 1,
  readContractVersion: 2,
  writeContractVersions: [1, 2],
  scenes: ['booking', 'approval', 'navigation', 'authored'].map((kind) => ({
    kind,
    versions: [1],
    contractVersions: kind === 'authored' ? [2] : [1, 2],
  })),
  records: [
    'purpose',
    'evidenceRecords',
    'actors',
    'rules',
    'areas',
    'journeys',
    'glossary',
  ],
  relationshipKinds: ['requires', 'related', 'blocks', 'triggers'],
  visual: {
    presentation: true,
    registeredRasterAssets: true,
    illustrations: presentationSchema.shape.illustration.options,
    accents: presentationSchema.shape.accent.options,
  },
  limits,
} as const
