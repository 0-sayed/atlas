import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
function scan(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (/^atlas-(island|water)\.png$/.test(entry.name))
      throw new Error(`Retired prototype artwork: ${path}`)
    if (/\.sqlite|^\.env|^\.local$|^planning$/.test(entry.name))
      throw new Error(`Private artifact: ${path}`)
    if (entry.isDirectory()) scan(path)
    else if (
      /\.(js|css)$/.test(path) &&
      /\/art\/atlas-(island|water)\.png/.test(readFileSync(path, 'utf8'))
    )
      throw new Error(`Retired prototype artwork reference: ${path}`)
    else if (
      /\.(js|html|css)$/.test(path) &&
      /ATLAS_WRITE_TOKEN|fixture-v2|publishing-studio-fixture|Atlas authored Publishing Studio fixture|Illustrative rules authored for this prototype|planning\/context\//.test(
        readFileSync(path, 'utf8'),
      )
    )
      throw new Error(`Private or compiled fixture content: ${path}`)
  }
}
scan('dist')
console.log(
  'Frontend artifacts contain no private storage, credentials, planning source or compiled fixture facts',
)
