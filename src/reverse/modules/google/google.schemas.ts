import { JSONSchemaType } from '@famir/common'
import { GoogleRecaptchaAnchor } from './google.js'

export const googleRecaptchaAnchorSchema: JSONSchemaType<GoogleRecaptchaAnchor> = {
  type: 'object',
  required: ['co'],
  properties: {
    co: {
      type: 'string',
    },
  },
  additionalProperties: true,
} as const
