import { EnvConfig } from '@famir/config'
import { ConsoleApp, loader } from '@famir/console-app'
import {
  RedisCampaignRepository,
  RedisDatabaseConnector,
  RedisDatabaseManager,
  RedisLureRepository,
  RedisMessageRepository,
  RedisProxyRepository,
  RedisRedirectorRepository,
  RedisSessionRepository,
  RedisTargetRepository,
} from '@famir/database'
import { CaddyEdgeServer } from '@famir/edge-server'
import { PinoLogger } from '@famir/logger'
import { BullAnalyzeQueue, BullWebhookQueue, RedisProducerConnector } from '@famir/producer'
import { CliReplServer, ReplServerAssets, ReplServerRouter } from '@famir/repl-server'
import { MinioStorage } from '@famir/storage'
import { EtaTemplater } from '@famir/templater'
import { AjvValidator } from '@famir/validator'
import { assets } from '../assets.js'
import { bannerGreet, main } from '../main.js'

loader({
  infra: (container) => {
    AjvValidator.register(container)

    EnvConfig.register(container)

    PinoLogger.register(container, {
      appName: 'console',
    })

    EtaTemplater.register(container)

    RedisDatabaseConnector.register(container)
    RedisDatabaseManager.register(container)

    RedisCampaignRepository.register(container)
    RedisProxyRepository.register(container)
    RedisTargetRepository.register(container)
    RedisRedirectorRepository.register(container)
    RedisLureRepository.register(container)
    RedisSessionRepository.register(container)
    RedisMessageRepository.register(container)

    MinioStorage.register(container)

    RedisProducerConnector.register(container)

    BullAnalyzeQueue.register(container)
    BullWebhookQueue.register(container)

    CaddyEdgeServer.register(container)

    ReplServerAssets.register(container, assets)
    ReplServerRouter.register(container)
    CliReplServer.register(container, {
      bannerGreet,
    })

    ConsoleApp.register(container)

    main(container)
  },

  start: async (container) => {
    await ConsoleApp.resolve(container).start()
  },

  stop: async (container) => {
    await ConsoleApp.resolve(container).stop()
  },
})
