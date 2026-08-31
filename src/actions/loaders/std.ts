import { ActionsApp, loader } from '@famir/actions-app'
import { EnvConfig } from '@famir/config'
import {
  BullAnalyzeWorker,
  BullWebhookWorker,
  ConsumerAssets,
  ConsumerRouter,
  RedisConsumerConnector,
} from '@famir/consumer'
import {
  RedisCampaignRepository,
  RedisDatabaseConnector,
  RedisMessageRepository,
  RedisProxyRepository,
  RedisSessionRepository,
  RedisTargetRepository,
} from '@famir/database'
import { PinoLogger } from '@famir/logger'
import { RedisProducerConnector } from '@famir/producer'
import { MinioStorage } from '@famir/storage'
import { EtaTemplater } from '@famir/templater'
import { AjvValidator } from '@famir/validator'
import { assets } from '../assets.js'
import { main } from '../main.js'

loader({
  infra: (container) => {
    AjvValidator.register(container)

    EnvConfig.register(container)

    PinoLogger.register(container, {
      appName: 'actions',
    })

    EtaTemplater.register(container)

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
      limiterDuration: 1000,
    })
    BullWebhookWorker.register(container, {
      concurrency: 2,
      limiterMax: 1,
      limiterDuration: 1000,
    })

    ActionsApp.register(container)

    main(container)
  },

  start: async (container) => {
    await ActionsApp.resolve(container).start()
  },

  stop: async (container) => {
    await ActionsApp.resolve(container).stop()
  },
})
