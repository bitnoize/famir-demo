import { DIContainer } from '@famir/common'
import { EnvConfig } from '@famir/config'
import { ConsoleApp } from '@famir/console-app'
import {
  RedisCampaignRepository,
  RedisDatabaseConnector,
  RedisDatabaseManager,
  RedisLureRepository,
  RedisMessageRepository,
  RedisProxyRepository,
  RedisRedirectorRepository,
  RedisSessionRepository,
  RedisTargetRepository
} from '@famir/database'
import { PinoLogger } from '@famir/logger'
import { BullAnalyzeQueue, RedisProduceConnector } from '@famir/produce'
import { CliReplServer, ReplServerRouter } from '@famir/repl-server'
import { AjvValidator } from '@famir/validator'
import { assets } from '../../assets.js'
import { main } from '../../main.js'
import { ConsoleConfig } from './cli.js'
import { consoleConfigSchema } from './cli.schemas.js'

export async function bootstrap(): Promise<void> {
  const container = DIContainer.getInstance()

  AjvValidator.register(container)

  EnvConfig.register<ConsoleConfig>(container, consoleConfigSchema)

  PinoLogger.register(container)

  RedisDatabaseConnector.register(container)
  RedisDatabaseManager.register(container)

  RedisCampaignRepository.register(container)
  RedisProxyRepository.register(container)
  RedisTargetRepository.register(container)
  RedisRedirectorRepository.register(container)
  RedisLureRepository.register(container)
  RedisSessionRepository.register(container)
  RedisMessageRepository.register(container)

  RedisProduceConnector.register(container)

  BullAnalyzeQueue.register(container)

  ReplServerRouter.register(container, assets)

  CliReplServer.register(container)

  ConsoleApp.register(container)

  main(container)

  await ConsoleApp.resolve(container).start()
}

export async function shutdown(): Promise<void> {
  const container = DIContainer.getInstance()

  await ConsoleApp.resolve(container).stop()
}
