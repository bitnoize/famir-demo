import { DIContainer, safeBase64Decode, safeBase64Encode } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse'
import { Validator, VALIDATOR } from '@famir/validator'
import { GOOGLE_CONTROLLER, GoogleRecaptchaAnchor } from './google.js'
import { googleSchemas } from './google.schemas.js'

export class GoogleController extends BaseController {
  static inject(container: DIContainer) {
    container.registerSingleton<GoogleController>(
      GOOGLE_CONTROLLER,
      (c) =>
        new GoogleController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): GoogleController {
    return container.resolve<GoogleController>(GOOGLE_CONTROLLER)
  }

  constructor(validator: Validator, logger: Logger, router: HttpServerRouter) {
    super(validator, logger, router)

    this.validator.addSchemas(googleSchemas)

    this.logger.debug(`GoogleController initialized`)
  }

  use() {
    this.router.addMiddleware('google', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const targets = this.getState(ctx, 'targets')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('google')) {
        //message.processor ??= 'dummy'

        message.addRewriteUrlMoreSchemes()
        message.addRewriteUrlContentTypes(['text/html', 'text/javascript'])

        message.addRequestHeadInterceptor('google', () => {
          const urlParams = message.url.getQueryString()

          if (message.method.is('GET') && message.url.isPath(/^\/recaptcha\/.+\/anchor$/)) {
            if (this.checkGoogleRecaptchaAnchor(urlParams)) {
              const oldHost = Buffer.from(safeBase64Decode(urlParams.co), 'base64').toString()

              const newHost = message.rewriteUrl(oldHost, true, targets)

              urlParams.co = safeBase64Encode(Buffer.from(newHost).toString('base64'))

              message.url.setQueryString(urlParams)
            }
          }
        })
      }

      await next()
    })
  }

  protected checkGoogleRecaptchaAnchor(value: unknown): value is GoogleRecaptchaAnchor {
    return this.validator.guardSchema<GoogleRecaptchaAnchor>(
      'reverse-google-recaptcha-anchor',
      value
    )
  }
}
