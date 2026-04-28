import { RedisDatabaseConfig } from '@famir/database'
import { CurlHttpClientConfig } from '@famir/http-client'
import { NativeHttpServerConfig } from '@famir/http-server'
import { PinoLoggerConfig } from '@famir/logger'
import { BullProduceConfig } from '@famir/produce'

export type ReverseConfig = PinoLoggerConfig &
  RedisDatabaseConfig &
  BullProduceConfig &
  CurlHttpClientConfig &
  NativeHttpServerConfig
