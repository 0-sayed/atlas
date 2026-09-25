# Atlas agent guidance

- Atlas is one React/TypeScript/Vite frontend with a local NestJS API and SQLite knowledge store. Keep `planning/` as development context; do not import its raw briefs or reference images into the app or `public/`.
- The app displays reviewed, implemented knowledge only. Do not infer current source-product behavior from fixture content, old Atlas content, or a passing build. Keep fixtures and historical snapshots explicitly labelled.
- The independent `fill-atlas` skill and template are maintained in `.agents/skills/fill-atlas/`. It produces source-context Markdown and stops; it does not modify Atlas source or run in the browser.
- Keep persisted product facts in SQLite via shared strict Zod contracts; `src/content/` contains API loading and pure view helpers, with presentation in scenes/components. Add only boundaries needed by a real activity; avoid a generic content engine.
- Use native controls, visible focus, clear unavailable states, and reduced-motion-safe presentation. Hash URLs must support direct loading and browser Back.
- Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:e2e`, and `npm run build` before claiming a branch is ready. Unit tests cover content/helper contracts; Playwright covers user navigation and interaction.
- Keep all changes within the task graph scope. T002 migrates the delivered booking fixture to the local data platform; T003 owns second-project exploration.
- `server/` owns the NestJS API and SQLite access; `shared/` owns strict versioned Zod contracts and pure scene helpers. `fixtures/` is demo-only and must never be imported by browser runtime code. SQL migrations are tracked in `migrations/`.
- Keep `.local/` and `.env` private and ignored. Tests must use temporary storage. Bind loopback; require the local write token and validate Host/Origin. Serve registered images only, never storage directories.
- Before changing migrations, verify nonempty upgrades and backup/restore. Preserve omitted features, scoped references, immutable history, revision conflicts and transactional rollback.
- `npm run validate` runs all required checks plus artifact and production restart/shutdown smoke checks. Run backend integration/API tests against the real production SQLite binding. Security scanning stays in separate CI jobs.
- Atlas's source repository is public but remains all rights reserved, with no open-source license selected. Keep local knowledge and credentials private; do not select a license or publish release artifacts without the owner's decision.
