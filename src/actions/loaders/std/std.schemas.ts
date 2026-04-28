import {
  configRedisConsumeConnectionUrlSchema,
  configRedisConsumePrefixSchema
} from '@famir/consume'
import {
  configRedisDatabaseConnectionUrlSchema,
  configRedisDatabasePrefixSchema
} from '@famir/database'
import { configLoggerAppNameSchema, configLoggerLogLevelSchema } from '@famir/logger'
import {
  configRedisProduceConnectionUrlSchema,
  configRedisProducePrefixSchema
} from '@famir/produce'
import {
  configMinioStorageEndPointSchema,
  configMinioStoragePortSchema,
  configMinioStorageUseSSLSchema,
  configStorageAccessKeySchema,
  configStorageBucketNameSchema,
  configStorageSecretKeySchema
} from '@famir/storage'
import { JSONSchemaType } from '@famir/validator'
import { ActionsConfig } from './std.js'

export const actionsConfigSchema: JSONSchemaType<ActionsConfig> = {
  type: 'object',
  required: [
    'LOGGER_APP_NAME',
    'LOGGER_LOG_LEVEL',
    'DATABASE_CONNECTION_URL',
    'DATABASE_PREFIX',
    'STORAGE_END_POINT',
    'STORAGE_PORT',
    'STORAGE_USE_SSL',
    'STORAGE_ACCESS_KEY',
    'STORAGE_SECRET_KEY',
    'STORAGE_BUCKET_NAME',
    'PRODUCE_CONNECTION_URL',
    'PRODUCE_PREFIX',
    'CONSUME_CONNECTION_URL',
    'CONSUME_PREFIX'
  ],
  properties: {
    LOGGER_APP_NAME: {
      ...configLoggerAppNameSchema,
      default: 'actions'
    },
    LOGGER_LOG_LEVEL: configLoggerLogLevelSchema,
    DATABASE_CONNECTION_URL: configRedisDatabaseConnectionUrlSchema,
    DATABASE_PREFIX: configRedisDatabasePrefixSchema,
    STORAGE_END_POINT: configMinioStorageEndPointSchema,
    STORAGE_PORT: configMinioStoragePortSchema,
    STORAGE_USE_SSL: configMinioStorageUseSSLSchema,
    STORAGE_ACCESS_KEY: configStorageAccessKeySchema,
    STORAGE_SECRET_KEY: configStorageSecretKeySchema,
    STORAGE_BUCKET_NAME: configStorageBucketNameSchema,
    PRODUCE_CONNECTION_URL: configRedisProduceConnectionUrlSchema,
    PRODUCE_PREFIX: configRedisProducePrefixSchema,
    CONSUME_CONNECTION_URL: configRedisConsumeConnectionUrlSchema,
    CONSUME_PREFIX: configRedisConsumePrefixSchema
  },
  additionalProperties: false
} as const
