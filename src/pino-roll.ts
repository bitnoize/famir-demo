import { DIContainer } from '@famir/common'
import { LOGGER_TRANSPORT, LoggerTransport } from '@famir/logger'
import { join } from 'path'
import pino from 'pino'

export function loadPinoRoll(appName: string) {
  const basePath = process.env['LOGGER_BASE_PATH'] ?? './logs'

  const loggerTransport = pino.transport({
    target: 'pino-roll',
    options: {
      file: join(basePath, appName + '/'),
      mkdir: true,
      symlink: true,
      frequency: 'daily',
      limit: {
        count: 7,
      },
    },
  })

  const container = DIContainer.getInstance()

  container.registerSingleton<LoggerTransport>(LOGGER_TRANSPORT, () => loggerTransport)
}
