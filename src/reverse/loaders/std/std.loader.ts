import { DIContainer } from '@famir/common'
import { EnvConfig } from '@famir/config'
import {
  RedisCampaignRepository,
  RedisDatabaseConnector,
  RedisLureRepository,
  RedisMessageRepository,
  RedisProxyRepository,
  RedisRedirectorRepository,
  RedisSessionRepository,
  RedisTargetRepository
} from '@famir/database'
import { CurlHttpClient } from '@famir/http-client'
import {
  HttpServerRouter,
  NativeHttpServer,
  HttpServerContextFactory,
  HttpServerAssets,
} from '@famir/http-server'
import { PinoLogger } from '@famir/logger'
import { BullAnalyzeQueue, RedisProducerConnector } from '@famir/producer'
import { ReverseApp } from '@famir/reverse-app'
import { EtaTemplater } from '@famir/templater'
import { AjvValidator } from '@famir/validator'
import { assets } from '../../assets.js'
import { main } from '../../main.js'

export async function bootstrap(): Promise<void> {
  const container = DIContainer.getInstance()

  AjvValidator.register(container)

  EnvConfig.register(container)

  PinoLogger.register(container)

  EtaTemplater.register(container)

  RedisDatabaseConnector.register(container)

  RedisCampaignRepository.register(container)
  RedisProxyRepository.register(container)
  RedisTargetRepository.register(container)
  RedisRedirectorRepository.register(container)
  RedisLureRepository.register(container)
  RedisSessionRepository.register(container)
  RedisMessageRepository.register(container)

  RedisProducerConnector.register(container)

  BullAnalyzeQueue.register(container)

  CurlHttpClient.register(container)

  HttpServerAssets.register(container, assets)

  HttpServerRouter.register(container)

  HttpServerContextFactory.register(container)

  NativeHttpServer.register(container)

  ReverseApp.register(container)

  main(container)

  await ReverseApp.resolve(container).start()
}

export async function shutdown(): Promise<void> {
  const container = DIContainer.getInstance()

  await ReverseApp.resolve(container).stop()
}
