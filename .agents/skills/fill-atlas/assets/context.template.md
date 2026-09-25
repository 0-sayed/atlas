# Product context — <product or activity>

## Scope

- Source: <project identity>
- Inspected revision / PR / range: <verified references; baseline and head for changes when available, or explicitly unknown>
- Coverage: <what was examined and important limits>
- Change type: <initial overview / added / changed / removed / no relevant behavioral change / inconclusive; use multiple types when supported>
- Merge / deployment: <only what is established; keep them distinct>

## What the product does

<Short explanation of who can accomplish what. Preserve an essential condition in the headline when omitting it would be misleading.> [E1]

## Relevant behavior

### <Activity>

- Who: <actor and relevant permissions> [E1]
- Action and result: <what happens> [E1]
- Conditions: <preconditions, states, exact thresholds/operators/units, and restrictions; include configuration or time-zone scope where relevant> [E2]
- Exceptions: <supported differences or explicitly unknown behavior> [E2; identify the evidence gap for unknowns]
- Connections: <specific requires / blocks / triggers meaning, when established> [E2]

## What changed

<Supported before → after, including important unchanged context. Omit for initial discovery or no-change findings. Cite evidence for each side of the comparison.> [E1 → E2]

## Examples

| Conditions                                                   | Outcome            | Evidence or limitation                                     |
| ------------------------------------------------------------ | ------------------ | ---------------------------------------------------------- |
| <supported conditions, with other relevant conditions fixed> | <supported result> | <E1; label a derived illustration or explicit uncertainty> |

## Unknowns or conflicts

<Missing evidence, incompatible sources, or configuration-dependent behavior. Omit if none were identified within the inspected scope; do not claim universal completeness.>

## Evidence

- E1: <source identity + revision + path/symbol or verified PR/document reference; what it supports>
- E2: <reference; distinguish tests read from tests actually run>
