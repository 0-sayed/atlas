# Atlas agent guidance

- Atlas is one static React/TypeScript/Vite app. Keep `planning/` as development context; do not import its raw briefs or reference images into the app or `public/`.
- The app displays reviewed, implemented knowledge only. Do not infer current source-product behavior from fixture content, old Atlas content, or a passing build. Label fixtures and historical snapshots explicitly when T001 adds them.
- The independent `fill-atlas` skill is a later task. It produces source-context Markdown and stops; it does not modify Atlas source or run in the browser.
- Keep product facts in small `src/content/` modules and presentation in scenes/components. Add only boundaries needed by a real activity; avoid a generic content engine.
- Use native controls, visible focus, clear unavailable states, and reduced-motion-safe presentation. Hash URLs must support direct loading and browser Back.
- Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:e2e`, and `npm run build` before claiming a branch is ready. Unit tests cover content/helper contracts; Playwright covers user navigation and interaction.
- Keep all changes within the task graph scope. T000 ends with the runnable foundation; booking behavior belongs to T001.
