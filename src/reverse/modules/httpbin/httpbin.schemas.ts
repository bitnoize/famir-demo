import { JSONSchemaType } from '@famir/validator'
import { HttpbinSpec } from './httpbin.js'

/**
 * @category Httpbin
 * @internal
 */
export const httpbinSpecSchema: JSONSchemaType<HttpbinSpec> = {
  type: 'object',
  required: ['basePath', 'host', 'info', 'protocol', 'schemes'],
  properties: {
    basePath: {
      type: 'string'
    },
    host: {
      type: 'string'
    },
    info: {
      type: 'object',
      required: ['contact', 'description', 'title', 'version'],
      properties: {
        contact: {
          type: 'object',
          required: [],
          properties: {
            email: {
              type: 'string',
              nullable: true
            },
            responsibleDeveloper: {
              type: 'string',
              nullable: true
            },
            responsibleOrganization: {
              type: 'string',
              nullable: true
            },
            url: {
              type: 'string',
              nullable: true
            }
          }
        },
        description: {
          type: 'string'
        },
        title: {
          type: 'string'
        },
        version: {
          type: 'string'
        }
      }
    },
    protocol: {
      type: 'string'
    },
    schemes: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  additionalProperties: true
} as const
