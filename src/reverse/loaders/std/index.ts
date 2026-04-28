import { bootstrap, shutdown } from './std.loader.js'

bootstrap().catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})

const SHUTDOWN_SIGNALS: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGQUIT']

SHUTDOWN_SIGNALS.forEach((signal) => {
  process.once(signal, () => {
    shutdown().catch((error: unknown) => {
      console.error(`App shutdown failed`, { error })

      process.exit(1)
    })
  })
})
