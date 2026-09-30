export function relationshipLabel(
  kind: 'requires' | 'related' | 'blocks' | 'triggers',
  outgoing: boolean,
) {
  return {
    requires: outgoing ? 'Requires' : 'Required by',
    related: 'Related to',
    blocks: outgoing ? 'Blocks' : 'Blocked by',
    triggers: outgoing ? 'Triggers' : 'Triggered by',
  }[kind]
}
