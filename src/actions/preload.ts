import { DIContainer } from '@famir/common'
import { LOGGER_BACKEND, PinoLoggerBackend } from '@famir/logger'
import { join } from 'path'
import pino from 'pino'

const container = DIContainer.getInstance()

const logger = pino({
  name: process.env['LOGGER_APP_NAME'] || 'actions',
  level: process.env['LOGGER_LOG_LEVEL'] || 'info',
  base: {},
  transport: {
    target: 'pino-roll',
    options: {
      file: join('logs', 'actions', 'log'),
      frequency: 'daily',
      mkdir: true
    }
  }
})

container.registerSingleton<PinoLoggerBackend>(LOGGER_BACKEND, () => logger)
