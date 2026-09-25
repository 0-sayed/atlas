import { createApp } from './app.js'
import { config } from './config.js'
let app: Awaited<ReturnType<typeof createApp>> | undefined
try {
  const settings = config()
  app = await createApp(settings)
  app.enableShutdownHooks()
  await app.listen(settings.port, '127.0.0.1')
  console.log(JSON.stringify({ event: 'atlas_ready', port: settings.port }))
} catch {
  await app?.close()
  console.error(
    JSON.stringify({
      event: 'atlas_start_failed',
      message:
        'Check local configuration, storage lock and database schema; no changes were served.',
    }),
  )
  process.exitCode = 1
}
