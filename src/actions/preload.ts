import { DIContainer } from '@famir/common'
import { LOGGER_TRANSPORT, LoggerTransport } from '@famir/logger'
import { join } from 'path'
import pino from 'pino'

const container = DIContainer.getInstance()

const loggerTransport = pino.transport({
  target: 'pino-roll',
  options: {
    file: join('logs', 'actions', 'log'),
    frequency: 'daily',
    mkdir: true,
  },
})

container.registerSingleton<LoggerTransport>(LOGGER_TRANSPORT, () => loggerTransport)
