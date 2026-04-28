import {
  configRedisDatabaseConnectionUrlSchema,
  configRedisDatabasePrefixSchema
} from '@famir/database'
import { configLoggerAppNameSchema, configLoggerLogLevelSchema } from '@famir/logger'
import {
  configRedisProduceConnectionUrlSchema,
  configRedisProducePrefixSchema
} from '@famir/produce'
import { configReplServerPromptSchema, configReplServerUseColorsSchema } from '@famir/repl-server'
import { JSONSchemaType } from '@famir/validator'
import { ConsoleConfig } from './cli.js'

export const consoleConfigSchema: JSONSchemaType<ConsoleConfig> = {
  type: 'object',
  required: [
    'LOGGER_APP_NAME',
    'LOGGER_LOG_LEVEL',
    'DATABASE_CONNECTION_URL',
    'DATABASE_PREFIX',
    'PRODUCE_CONNECTION_URL',
    'PRODUCE_PREFIX',
    'REPL_SERVER_PROMPT',
    'REPL_SERVER_USE_COLORS'
  ],
  properties: {
    LOGGER_APP_NAME: {
      ...configLoggerAppNameSchema,
      default: 'console'
    },
    LOGGER_LOG_LEVEL: configLoggerLogLevelSchema,
    DATABASE_CONNECTION_URL: configRedisDatabaseConnectionUrlSchema,
    DATABASE_PREFIX: configRedisDatabasePrefixSchema,
    PRODUCE_CONNECTION_URL: configRedisProduceConnectionUrlSchema,
    PRODUCE_PREFIX: configRedisProducePrefixSchema,
    REPL_SERVER_PROMPT: configReplServerPromptSchema,
    REPL_SERVER_USE_COLORS: configReplServerUseColorsSchema
  },
  additionalProperties: false
} as const
