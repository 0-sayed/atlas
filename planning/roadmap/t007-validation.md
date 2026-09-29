# T007 local design handoff validation

Date: 2026-09-29. Branch: `docs/t007-desktop-design-baseline`. Validation base: `b13b3e1aa45d964a8ffe1e4a259ef835e0b70fdd`. This records validation before the handoff commit; consult Git for subsequent commit and merge status.

The owner requested a simpler handoff: use the approved native Penpot file and a tracked [design reference](../context/design-reference.md), without a generated gallery or bulk export prerequisite. T007 now records that boundary; T008 remains the next application task.

- Native archive integrity: PASS. ZIP CRC check succeeded; metadata identifies file `a5ac146a-5787-80fa-8008-b2b1c7b55d1f`, revision 227. All 183 recorded source entries match the previous source inventory.
- Local copy: PASS. `.local/design/atlas.penpot` is byte-identical to the owner-supplied download; SHA-256 is `c2473a7f266e70f028e469f00694a9b2ddc200434cd00e28a1d3d3c7380d11f1`. The original remains intact.
- Preservation/privacy: PASS. The previous generated package and validation report are preserved under `.local/archive/t007-export-package-2026-09-29/`. Git ignores both the native file and archive.
- Scope: documentation and local source organization only. Application code is unchanged.
- Pre-ship validation: PASS on 2026-09-29. `npm run validate` passed formatting, lint, typechecking, 60 unit/integration tests, 38 browser tests, builds, artifact privacy checks and production restart/shutdown smoke. These checks do not establish visual implementation.

The reference explains missing-file retrieval from the owner, relevant boards, dynamic project boundaries, task-scoped asset extraction and content-fitting card containment. Native-file integrity is not a new visual audit. T005 human evaluation remains open; T008–T011 are unimplemented. No commit, merge or release is claimed.
