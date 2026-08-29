import { DIContainer, safeBase64Decode, safeBase64Encode } from '@famir/common'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  HttpServerAssets,
  HttpServerRouter
} from '@famir/http-server'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-app'
import { TEMPLATER, Templater } from '@famir/templater'
import { Validator, VALIDATOR } from '@famir/validator'
import { GoogleRecaptchaAnchor } from './google.js'
import { googleRecaptchaAnchorSchema } from './google.schemas.js'

/**
 * DI token for the google controller.
 *
 * @category Google
 */
export const GOOGLE_CONTROLLER = Symbol('GoogleController')

/**
 * Represents the google controller.
 *
 * @category Google
 */
export class GoogleController extends BaseController {
  /**
   * Registers the controller as a singleton in the DI container.
   *
   * @param container - The DI container to register in.
   */
  static register(container: DIContainer) {
    container.registerSingleton<GoogleController>(
      GOOGLE_CONTROLLER,
      (c) =>
        new GoogleController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<Templater>(TEMPLATER),
          c.resolve<HttpServerAssets>(HTTP_SERVER_ASSETS),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  /**
   * Resolves the controller from the DI container.
   *
   * @param container - The DI container to resolve from.
   * @returns The controller instance.
   */
  static resolve(container: DIContainer): GoogleController {
    return container.resolve(GOOGLE_CONTROLLER)
  }

  /**
   * Creates a new controller instance.
   *
   * @param validator - The validator instance.
   * @param logger - The logger instance.
   * @param templater - The templater instance.
   * @param assets - The assets instance.
   * @param router - The router instance.
   */
  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    assets: HttpServerAssets,
    router: HttpServerRouter
  ) {
    super(validator, logger, templater, assets, router)

    this.validator.addSchema('reverse-google-recaptcha-anchor', googleRecaptchaAnchorSchema)
  }

  /**
   * Registers used middleware in the router.
   */
  use() {
    this.router.addMiddleware('google', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const targets = this.getState(ctx, 'targets')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('google')) {
        message.addRewriteUrlExtraSchemes()
        message.addRewriteUrlContentTypes(['text/html', 'text/javascript'])

        message.addRequestHeadInterceptor('google', () => {
          const urlParams = message.url.getQueryString()

          if (message.method.is('GET') && message.url.isPath(/^\/recaptcha\/.+\/anchor$/)) {
            if (this.checkGoogleRecaptchaAnchor(urlParams)) {
              const oldHost = safeBase64Decode(urlParams.co).toString()

              const newHost = message.rewriteUrl(oldHost, true, targets)

              urlParams.co = safeBase64Encode(Buffer.from(newHost))

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
