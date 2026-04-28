import {
  configRedisDatabaseConnectionUrlSchema,
  configRedisDatabasePrefixSchema
} from '@famir/database'
import { configHttpClientVerboseSchema } from '@famir/http-client'
import {
  configHttpServerAddressSchema,
  configHttpServerPortSchema,
  configHttpServerVerboseSchema
} from '@famir/http-server'
import { configLoggerAppNameSchema, configLoggerLogLevelSchema } from '@famir/logger'
import {
  configRedisProduceConnectionUrlSchema,
  configRedisProducePrefixSchema
} from '@famir/produce'
import { JSONSchemaType } from '@famir/validator'
import { ReverseConfig } from './std.js'

export const reverseConfigSchema: JSONSchemaType<ReverseConfig> = {
  type: 'object',
  required: [
    'LOGGER_APP_NAME',
    'LOGGER_LOG_LEVEL',
    'DATABASE_CONNECTION_URL',
    'DATABASE_PREFIX',
    'PRODUCE_CONNECTION_URL',
    'PRODUCE_PREFIX',
    'HTTP_CLIENT_VERBOSE',
    'HTTP_SERVER_ADDRESS',
    'HTTP_SERVER_PORT',
    'HTTP_SERVER_VERBOSE'
  ],
  properties: {
    LOGGER_APP_NAME: {
      ...configLoggerAppNameSchema,
      default: 'reverse'
    },
    LOGGER_LOG_LEVEL: configLoggerLogLevelSchema,
    DATABASE_CONNECTION_URL: configRedisDatabaseConnectionUrlSchema,
    DATABASE_PREFIX: configRedisDatabasePrefixSchema,
    PRODUCE_CONNECTION_URL: configRedisProduceConnectionUrlSchema,
    PRODUCE_PREFIX: configRedisProducePrefixSchema,
    HTTP_CLIENT_VERBOSE: configHttpClientVerboseSchema,
    HTTP_SERVER_ADDRESS: {
      ...configHttpServerAddressSchema,
      default: '127.0.0.1'
    },
    HTTP_SERVER_PORT: {
      ...configHttpServerPortSchema,
      default: 3000
    },
    HTTP_SERVER_VERBOSE: configHttpServerVerboseSchema
  },
  additionalProperties: false
} as const
