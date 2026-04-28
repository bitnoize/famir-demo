import { ActionsApp } from '@famir/actions-app'
import { DIContainer } from '@famir/common'
import { EnvConfig } from '@famir/config'
import { BullAnalyzeWorker, ConsumeRouter, RedisConsumeConnector } from '@famir/consume'
import {
  RedisCampaignRepository,
  RedisDatabaseConnector,
  RedisMessageRepository,
  RedisProxyRepository,
  RedisSessionRepository,
  RedisTargetRepository
} from '@famir/database'
import { PinoLogger } from '@famir/logger'
import { RedisProduceConnector } from '@famir/produce'
import { MinioStorage } from '@famir/storage'
import { AjvValidator } from '@famir/validator'
import { assets } from '../../assets.js'
import { main } from '../../main.js'
import { specs } from '../../specs.js'
import { ActionsConfig } from './std.js'
import { actionsConfigSchema } from './std.schemas.js'

export async function bootstrap(): Promise<void> {
  const container = DIContainer.getInstance()

  AjvValidator.register(container)

  EnvConfig.register<ActionsConfig>(container, actionsConfigSchema)

  PinoLogger.register(container)

  RedisDatabaseConnector.register(container)

  RedisCampaignRepository.register(container)
  RedisProxyRepository.register(container)
  RedisTargetRepository.register(container)
  RedisSessionRepository.register(container)
  RedisMessageRepository.register(container)

  MinioStorage.register(container)

  RedisProduceConnector.register(container)

  RedisConsumeConnector.register(container)

  ConsumeRouter.register(container, specs, assets)

  BullAnalyzeWorker.register(container)

  ActionsApp.register(container)

  main(container)

  await ActionsApp.resolve(container).start()
}

export async function shutdown(): Promise<void> {
  const container = DIContainer.getInstance()

  await ActionsApp.resolve(container).stop()
}
