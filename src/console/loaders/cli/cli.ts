import { RedisDatabaseConfig } from '@famir/database'
import { PinoLoggerConfig } from '@famir/logger'
import { BullProduceConfig } from '@famir/produce'
import { CliReplServerConfig } from '@famir/repl-server'

export type ConsoleConfig = PinoLoggerConfig &
  RedisDatabaseConfig &
  BullProduceConfig &
  CliReplServerConfig
