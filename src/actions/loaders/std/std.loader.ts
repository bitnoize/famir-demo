import { ActionsApp } from '@famir/actions-app'
import { DIContainer } from '@famir/common'
import { EnvConfig } from '@famir/config'
import { BullAnalyzeWorker, ConsumerRouter, RedisConsumerConnector, ConsumerAssets } from '@famir/consumer'
import {
  RedisCampaignRepository,
  RedisDatabaseConnector,
  RedisMessageRepository,
  RedisProxyRepository,
  RedisSessionRepository,
  RedisTargetRepository
} from '@famir/database'
import { PinoLogger } from '@famir/logger'
import { RedisProducerConnector } from '@famir/producer'
import { MinioStorage } from '@famir/storage'
import { AjvValidator } from '@famir/validator'
import { assets } from '../../assets.js'
import { main } from '../../main.js'

export async function bootstrap(): Promise<void> {
  const container = DIContainer.getInstance()

  AjvValidator.register(container)

  EnvConfig.register(container)

  PinoLogger.register(container)

  RedisDatabaseConnector.register(container)

  RedisCampaignRepository.register(container)
  RedisProxyRepository.register(container)
  RedisTargetRepository.register(container)
  RedisSessionRepository.register(container)
  RedisMessageRepository.register(container)

  MinioStorage.register(container)

  RedisProducerConnector.register(container)

  RedisConsumerConnector.register(container)

  ConsumerAssets.register(container, assets)

  ConsumerRouter.register(container)

  BullAnalyzeWorker.register(container, {
    concurrency: 2,
    limiterMax: 1,
    limiterDuration: 1000
  })

  ActionsApp.register(container)

  main(container)

  await ActionsApp.resolve(container).start()
}

export async function shutdown(): Promise<void> {
  const container = DIContainer.getInstance()

  await ActionsApp.resolve(container).stop()
}
