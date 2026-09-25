import { resolve } from 'node:path'
import { Store } from './store.js'
import { backup, restore } from './backup.js'
const [command, target] = process.argv.slice(2)
const dir = resolve(process.env.ATLAS_DATA_DIR ?? '.local')
if (command === 'migrate') {
  const store = new Store(dir)
  store.close()
  console.log('Storage schema ready')
} else if (command === 'backup' && target) {
  await backup(dir, resolve(target))
  console.log('Database and assets backed up')
} else if (command === 'restore' && target) {
  await restore(resolve(target), dir)
  console.log('Database and assets restored')
} else
  throw new Error(
    'Usage: storage migrate | backup NEW_DIRECTORY | restore BACKUP_DIRECTORY (restore requires a new ATLAS_DATA_DIR)',
  )
