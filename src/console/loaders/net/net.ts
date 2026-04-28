import { RedisDatabaseConfig } from '@famir/database'
import { PinoLoggerConfig } from '@famir/logger'
import { BullProduceConfig } from '@famir/produce'
import { NetReplServerConfig } from '@famir/repl-server'

export type ConsoleConfig = PinoLoggerConfig &
  RedisDatabaseConfig &
  BullProduceConfig &
  NetReplServerConfig
