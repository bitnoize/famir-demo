import { JSONSchemaType } from '@famir/validator'
import { GoogleRecaptchaAnchor } from './google.js'

/**
 * @category Google
 * @internal
 */
export const googleRecaptchaAnchorSchema: JSONSchemaType<GoogleRecaptchaAnchor> = {
  type: 'object',
  required: [],
  properties: {
    co: {
      type: 'string'
    }
  },
  additionalProperties: true
} as const
