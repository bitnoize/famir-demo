import { bootstrap, shutdown } from './std.loader.js'

// Uncaught exception handler.
process.on('uncaughtException', (error: Error) => {
  console.error(`Uncaught exception`, { error })

  process.exit(1)
})

// Unhandled rejection handler.
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error(`Unhandled rejection`, { reason, promise })

  process.exit(1)
})

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
