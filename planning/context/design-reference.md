# Atlas design reference

**Verified:** 2026-09-28 through the connected Penpot MCP plugin, read-only. File **New File 1**, ID `a5ac146a-5787-80fa-8008-b2b1c7b55d1f`, revision **226**. This is the shared lookup for design context, not a new design specification or permission to implement features.

## Start here

1. Read [DESIGN](business/DESIGN.md) for behavior and [compact component rules](business/DESIGN.md#compact-content-driven-component-rules).
2. Open the [design review hub](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b317f2f5d6f0&index=0), then the relevant desktop boards below.
3. Inspect the shared foundations, components and application shell on the Design system page before implementing a screen.
4. Use the task mapping below and the [delivery brief](../roadmap/desktop-delivery.md) to separate design intent from current data capabilities. Demo Shop and Review Workspace illustrate layouts; they are not source-product facts.

Access requires permission to the Penpot file. Viewer links identify the live file/page/frame, **not an immutable revision**. The board IDs were checked against the connected file; this pass did not browser-click every viewer link. If a viewer opens the wrong frame, verify its displayed title and locate the recorded board ID in the editor rather than assuming the first frame is correct.

## Dynamic projects, illustrative ecommerce screens

Atlas is a reusable guide for different web projects, not an ecommerce application. The dominant Penpot example is Demo Shop; Orders, Cart, Checkout, Customer and cancellation conditions are illustrative project content. Reuse the visual language and interaction patterns, not those domain facts.

| Shared Atlas design | Supplied by reviewed project data |
|---|---|
| Tokens, typography, controls, shell and seven destination types | Project title/purpose, domain vocabulary and optional area groups |
| Reusable activity, case, relationship and map compositions | Activities, actors, rules, ordered journeys, cases/outcomes, glossary and supported artwork choices |
| Content-fitting layout, focus, Back and empty/error behavior | Item counts, text lengths, missing optional facts and evidence status |

For example, the same area-to-activity composition can show Orders → Cancel order for a shop or Documents → Request review for a review workspace. The second project must supply its own reviewed actors, conditions and outcomes; renaming ecommerce labels is insufficient. These are illustrative examples, not an instruction to seed either project.

Do not hard-code commerce categories, a fixed island count, shop-specific routes or business rules into shared components. Render supported project knowledge from the API in the same unchanged build. Keep optional content absent when unknown, and let layouts adapt to short, long and missing content. The fixed sidebar destinations organize knowledge; their contents vary by project.

**Current capability limit:** booking, approval and navigation are the implemented scene kinds. Broader authored activities and supporting records are planned in T009. An activity outside supported patterns is a renderer gap, not permission to invent a navigation case. The direction covers varied web applications; it does not claim that every possible project is supported today. See [product scope](business/PROJECT.md) and [technical boundaries](technical/TECHNICAL.md).

## Version and scope

- Desktop page: **Atlas · Illustrated experience**, ID `b06c7e1e-1498-8079-8008-b2c660ae456d` — **50 boards**.
- System page: **Atlas · Design system**, ID `e2cc1aab-2416-803a-8008-b3d2364d2f47` — **9 boards**.
- Latest named checkpoint found: **Center cancellation outcome arrows between cards**, saved **2026-09-28T09:39:55.322Z**.
- The live revision is recorded separately; do not assume that checkpoint and revision 226 have identical content. T007 must choose and capture a synchronized baseline before visual implementation acceptance.
- Mobile/tablet studies remain deferred. Do not use old desktop copies of system boards or historical page/board IDs from transcripts.
- System boards, the review hub and shell template are design documentation, not extra application routes. The shell's central placeholder is for composed screen content.
- Penpot component/token changes can affect linked design instances; they do not automatically update React components or CSS. Inspect instance overrides and scene siblings before assuming propagation.

## Design system boards

| Reference | Use |
|---|---|
| [01 · Foundations — color, type and geometry](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3d2cf739ecd&index=0) | Semantic colors, typography, spacing and geometry |
| [02 · Core components](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3d2fb4c9845&index=0) | Buttons, badges, fields and component states |
| [03 · Navigation and layout patterns](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3d33691a1d7&index=0) | Navigation items, tabs and composition patterns |
| [04 · Icons and using the system](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3d4299526c1&index=0) | Vector icons and system usage |
| [Atlas / Layout / Application shell](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2c8d6b23ef2&index=0) | Shared header/sidebar master; not a blank product screen |
| [06 · Artwork — composition and scenery masters](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3ed96cef568&index=0) | Editable content versus scenery; reusable illustration masters |
| [08 · Content boundaries — design and reviewed knowledge](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3ed96cef580&index=0) | Static design, reviewed facts and authoring boundaries |
| [07 · Editing guide — changes and verification](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3ed96cef5b0&index=0) | Editing and verification guidance |
| [09 · Map composition — growth and density](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=e2cc1aab-2416-803a-8008-b3d2364d2f47&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3ed96cef5ff&index=0) | Map density, progressive detail and camera behavior |

### Tokens, typography and component lookup

The local library contains **46 components** and the **atlas/core** token set with **46 tokens** at this inspection. Resolve color, spacing, radius, sizing and control/badge font-size values from the library; the Foundations board explains their use. Do not sample a screenshot or substitute library defaults. Typography assets use Kalam, Patrick Hand and Nunito; confirm the specific shared typography and font rights for each role during T007.

Use the following main-instance IDs with Penpot inspection/export tools; these are shape IDs, not library component IDs. Names are a convenience; IDs distinguish repeated Default/Selected labels. Icon masters use the `Atlas / Icons /` prefix and are indexed on the Icons board.

| Shared component | Main-instance shape ID |
|---|---|
| Atlas / Artwork / hero | `b06c7e1e-1498-8079-8008-b2d724bcbe6c` |
| Atlas / Artwork / island | `b06c7e1e-1498-8079-8008-b2d7248f7643` |
| Atlas / Artwork / panorama | `b06c7e1e-1498-8079-8008-b2d724eac26d` |
| Atlas / Badge / Info | `b06c7e1e-1498-8079-8008-b2e7d473983f` |
| Atlas / Badge / Success | `b06c7e1e-1498-8079-8008-b2e7d4ab1e70` |
| Atlas / Badge / Unavailable | `b06c7e1e-1498-8079-8008-b2e7d4f0dc15` |
| Atlas / Badge / Warning | `b06c7e1e-1498-8079-8008-b2e7d4cfb5bc` |
| Atlas / Button / Primary / Default | `b06c7e1e-1498-8079-8008-b2d723abfcb7` |
| Atlas / Button / Primary states | `b06c7e1e-1498-8079-8008-b2e7d28a6a8c` |
| Atlas / Button / Secondary / Default | `b06c7e1e-1498-8079-8008-b2d724042bc1` |
| Atlas / Card / Explanation | `b06c7e1e-1498-8079-8008-b2e7d512ed0d` |
| Atlas / Card / Section | `b06c7e1e-1498-8079-8008-b2e7d58f06db` |
| Atlas / Icons / arrow | `b06c7e1e-1498-8079-8008-b2c8d6867fa6` |
| Atlas / Icons / bell | `b06c7e1e-1498-8079-8008-b2c8d607bdcb` |
| Atlas / Icons / book | `b06c7e1e-1498-8079-8008-b2c8d5c7c6f1` |
| Atlas / Icons / box | `b06c7e1e-1498-8079-8008-b2c8d5dccbeb` |
| Atlas / Icons / cancel | `b06c7e1e-1498-8079-8008-b2c8d61efad9` |
| Atlas / Icons / card | `b06c7e1e-1498-8079-8008-b2c8d5f1bcd5` |
| Atlas / Icons / cart | `b06c7e1e-1498-8079-8008-b2c8d5e798fe` |
| Atlas / Icons / check | `b06c7e1e-1498-8079-8008-b2c8d62a7818` |
| Atlas / Icons / clock | `b06c7e1e-1498-8079-8008-b2c8d5d22fc1` |
| Atlas / Icons / close | `b06c7e1e-1498-8079-8008-b2c8d691fb60` |
| Atlas / Icons / compass | `b06c7e1e-1498-8079-8008-b2c8d598f29b` |
| Atlas / Icons / flag | `b06c7e1e-1498-8079-8008-b2c8d635b101` |
| Atlas / Icons / journey | `b06c7e1e-1498-8079-8008-b2c8d5a657da` |
| Atlas / Icons / link | `b06c7e1e-1498-8079-8008-b2c8d64d3e94` |
| Atlas / Icons / mail | `b06c7e1e-1498-8079-8008-b2c8d664ba9a` |
| Atlas / Icons / map | `b06c7e1e-1498-8079-8008-b2c8d58ee977` |
| Atlas / Icons / mountain | `b06c7e1e-1498-8079-8008-b2c8d5851622` |
| Atlas / Icons / people | `b06c7e1e-1498-8079-8008-b2c8d5b29db0` |
| Atlas / Icons / rule | `b06c7e1e-1498-8079-8008-b2c8d5bce093` |
| Atlas / Icons / screen | `b06c7e1e-1498-8079-8008-b2c8d69d1e62` |
| Atlas / Icons / search | `b06c7e1e-1498-8079-8008-b2c8d5fc8f02` |
| Atlas / Icons / shield | `b06c7e1e-1498-8079-8008-b2c8d66fe9fb` |
| Atlas / Icons / shop | `b06c7e1e-1498-8079-8008-b2c8d659c6b0` |
| Atlas / Icons / spark | `b06c7e1e-1498-8079-8008-b2c8d6a91b4b` |
| Atlas / Icons / target | `b06c7e1e-1498-8079-8008-b2c8d67b7020` |
| Atlas / Icons / user | `b06c7e1e-1498-8079-8008-b2c8d6128a5a` |
| Atlas / Icons / warning | `b06c7e1e-1498-8079-8008-b2c8d641436e` |
| Atlas / Layout / Application shell | `b06c7e1e-1498-8079-8008-b2c8d6b23ef2` |
| Atlas / Navigation item / Default | `b06c7e1e-1498-8079-8008-b2e7d3b40efd` |
| Atlas / Navigation item / Selected | `b06c7e1e-1498-8079-8008-b2e7d3ec7e1a` |
| Atlas / Search field / Default | `b06c7e1e-1498-8079-8008-b2e7d556b421` |
| Atlas / View tab / Default | `b06c7e1e-1498-8079-8008-b2e7d41b829d` |
| Atlas / View tab / Selected | `b06c7e1e-1498-8079-8008-b2e7d440c066` |

**Section caution:** the legacy Section main instance contains the header/background while many body elements are scene siblings. Auto-sizing that master alone previously broke containment. Inspect the whole composition; runtime cards must own their title, body and actions. See the compact component rules rather than copying fixed screenshot heights.

## Desktop screen index

All entries below were found on the verified desktop page. Board names describe illustrative compositions; they do not add project-specific routes or contracts.

| Desktop board |
|---|
| [01 · Start Here — the island overview](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2c9e7249565&index=0) |
| [02 · Orders — area to feature](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2c9e9671319&index=0) |
| [03 · Cancel order — feature explanation](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2c9eb5d45b2&index=0) |
| [07 · Feature Map — browse areas and features](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2ce12d74e42&index=0) |
| [04 · Manage an order — optional cancellation branch](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d44dee510e&index=0) |
| [05 · Cancel order — typed relationships](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d4502feb06&index=0) |
| [06 · Cancel order — rule conditions](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d452cd3083&index=0) |
| [12 · Cancellation unavailable — explain the outcome](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d456155802&index=0) |
| [08 · Recent Changes — source to product meaning](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d4ac16080a&index=0) |
| [09 · Actors — roles and participation](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d4af73ff2f&index=0) |
| [10 · Rules — conditions across the project](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d4b219ea03&index=0) |
| [11 · Glossary — product language in context](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d4b4bb71c8&index=0) |
| [00 · Atlas — prototype journey map](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d56457e3ea&index=0) |
| [13 · Empty workspace — no automatic demo](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d567b47fe3&index=0) |
| [Overlay · Feature search example](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d56cdd446f&index=0) |
| [Overlay · Project switcher](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d56dc5a28b&index=0) |
| [Help · Prepare reviewed knowledge](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d56ea5c34e&index=0) |
| [Area · Catalog](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d65e720bbb&index=0) |
| [Area · Search](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d660a9bfb2&index=0) |
| [Area · Cart](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d6631e3796&index=0) |
| [Area · Checkout](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d665dce57b&index=0) |
| [Area · Account](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d668e2f739&index=0) |
| [Area · Notifications](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2d66c80a819&index=0) |
| [State · Loading a selected project](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e86517f59d&index=0) |
| [State · First load failed](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e867ea2eff&index=0) |
| [State · Refresh failed · last loaded](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3ff7264b11f&index=0) |
| [State · Partial and uncertain knowledge](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e86ba34162&index=0) |
| [State · No matching activity](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e8704f1306&index=0) |
| [Browse · Recorded activities](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e873bd238d&index=0) |
| [Browse · Filtered activity results](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e87acb501a&index=0) |
| [Detail · Allowed case and evidence](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e88138fe53&index=0) |
| [Detail · Unavailable case and evidence](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e88833902c&index=0) |
| [Change · New behavior](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e88f8ba4eb&index=0) |
| [Change · Removed behavior](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e894b252b0&index=0) |
| [Change · Reviewed work without product impact](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e89a2ac97c&index=0) |
| [Project proof · Review Workspace](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e8a11a4eb9&index=0) |
| [State · Project with scaffolding only](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e8b09b15ee&index=0) |
| [State · Conflicting evidence](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b2e8b868b099&index=0) |
| [Feature Map · the whole product](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b3065bdf8a4f&index=0) |
| [Feature Map · Orders](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b306692eb9f0&index=0) |
| [Orders · Manage orders](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b306763c4471&index=0) |
| [Find a feature on the map](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b306846db0fb&index=0) |
| [All areas · list view](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b3068a9158ba&index=0) |
| [Start Here · compact project](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b3121fb1c099&index=0) |
| [Orders · manage orders](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b3122510c8c8&index=0) |
| [Map · camera position A](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b3122c1fad9e&index=0) |
| [Map · camera position B](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b312356bdd65&index=0) |
| [Start Here · understand a connection](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b3123f554e3d&index=0) |
| [00 · Review the complete Atlas design](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=b06c7e1e-1498-8079-8008-b317f2f5d6f0&index=0) |
| [Review · Empty and recovery states](https://design.penpot.app/#/view?file-id=a5ac146a-5787-80fa-8008-b2b1c7b55d1f&page-id=b06c7e1e-1498-8079-8008-b2c660ae456d&section=interactions&frame-id=e2cc1aab-2416-803a-8008-b3ff7b874075&index=0) |

## Task-to-design mapping

| Task | Read or inspect | Boundary |
|---|---|---|
| T007 — design package | Review hub; all nine System boards; desktop index and state boards | Capture one named version, matching exports, token values, assets/provenance, component states and data bindings. This reference is only the lookup, not completion of that package. |
| T008 — two-screen proof | Foundations, Core components, Navigation patterns, Application shell, Artwork; Start Here, compact project, feature explanation, Review Workspace, loading/empty/failure states | Adapt the composition to the existing labelled Publishing Studio overview and supported navigation activity. Do not invent commerce facts or force unsupported actions into navigation. |
| T009 — cross-domain knowledge | Content boundaries; Review Workspace; rule conditions, typed relationships, allowed/unavailable detail, conflicting evidence and change examples | Define reviewed facts and supported reusable renderers; visuals are not evidence and do not authorize arbitrary layouts. |
| T010 — desktop destinations | All seven destination examples; area/detail pages; whole-product/Orders/Manage orders maps, search/list, camera A/B and connection examples; Map composition | Implement saved-data views, shared controls, direct links/Back, meaningful map behavior and honest states. Camera screenshots illustrate states, not a working continuous canvas implementation. |
| T011 — acceptance | T007's captured baseline; sparse/compact project, all empty/recovery states, Review Workspace, map and changes | Verify real variable content and three distinct domains in the same build. Do not use static Penpot examples as proof of source accuracy. |

## Existing exports and assets

These paths are relative to the repository. Ignored local files are supplementary and are **not included in a fresh clone**.

| Location | Status and use |
|---|---|
| `.local/audits/desktop-2026-09-28/inventory.json` and `NN-BOARD_ID.png` in the same directory | Existing desktop inventory and 50 PNGs. Cached audit exports; not asserted to match live revision 226. |
| `.local/audits/desktop-2026-09-28/system/inventory.json` and `NN-BOARD_ID.png` | Existing System inventory and nine PNGs, also historical audit exports. |
| `.local/audits/desktop-2026-09-28/final-cleanup.md` | Dated contrast/sidebar cleanup evidence, not a synchronized final export manifest. |
| `.local/penpot-design/` | Earlier scripts and mixed-date exports. Historical working material, not the current design baseline. |
| `public/art/` and `public/fonts/` | Existing app assets; an incomplete implementation asset set, not an export of the entire Penpot library. Check provenance and font notices before reuse. |
| `planning/context/business/references/` | Original concept/inspiration images; not current implementation screenshots. |

T007 remains pending until a synchronized, accessible design package exists, including token values, component states, typography/assets/provenance, interactions and data bindings. Record approved export locations here when that work is authorized and verified; do not mark it complete because live links now exist.

## How an agent retrieves context

For read-only MCP inspection, open this file in Penpot with its MCP plugin connected. Read the tool's high-level overview, check `penpot.currentFile.id`, and discover pages with `penpotUtils.getPages()`. Look up recorded IDs with `penpotUtils.findShapeById(id)`, inspect library tokens/components, and export only the boards needed for the selected task. A disconnected or suspended plugin is an access issue, not evidence that a design is absent.

When live access is unavailable, use the synchronized T007 package if one has been completed and made accessible. Today's local audit exports are historical; report missing access or baseline artifacts before claiming visual fidelity. Do not recreate unseen designs from memory. Do not mutate Penpot merely to gather implementation context.

When the design changes, refresh this file's revision/checkpoint, affected board references and captured artifact locations together. Keep [DESIGN](business/DESIGN.md) authoritative for experience rules and [TECHNICAL](technical/TECHNICAL.md) authoritative for implemented versus proposed capabilities.

