# Atlas

Atlas is a visual guide for understanding how a product works and how its behavior changes. The current app is a navigable foundation. The illustrated booking fixture is planned for T001; this build has no live product data, verified source rules, or booking behavior.

## Run locally

Use Node 22.23.2 and npm. Run `npm ci`, then `npm run dev`. The dev server listens on `127.0.0.1` by default. Open the address Vite prints.

## Verify

Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, and `npm run test:e2e`. Install the Chromium test browser with `npx playwright install chromium` if needed. The browser suite builds the app and tests a fresh production preview on loopback; `npm run build` also verifies the build by itself. Browser tests cover the shell; T001 will add the booking learning-loop checks.

The static app uses hash URLs, such as `/#/explore`, so direct links work without server rewrites. `src/content/` holds maintained guide content; `src/App.tsx` presents it. Development evidence and planning references stay outside the browser build.

Start with the [project scope](planning/context/business/PROJECT.md), [design direction](planning/context/business/DESIGN.md), [technical baseline](planning/context/technical/TECHNICAL.md), and [task graph](planning/roadmap/tasks.md). The [bootstrap checklist](planning/bootstrap.md) tracks repository setup.

No software license has been granted yet. All rights are reserved until the project owner chooses one. The illustrations in `planning/context/business/references/` are design references and are not shipped by the app.
