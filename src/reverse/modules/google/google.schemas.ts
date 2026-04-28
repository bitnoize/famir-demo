import { JSONSchemaType, ValidatorSchemas } from '@famir/validator'
import { GoogleRecaptchaAnchor } from './google.js'

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

export const googleSchemas: ValidatorSchemas = {
  'reverse-google-recaptcha-anchor': googleRecaptchaAnchorSchema
}
