import { DIContainer, safeBase64Decode, safeBase64Encode } from '@famir/common'
import { Logger, LOGGER, TEMPLATER, Templater, Validator, VALIDATOR } from '@famir/domain'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  HttpServerMiddleware,
  type HttpServerAssets,
  type HttpServerRouter,
} from '@famir/http-server'
import { BaseController } from '@famir/reverse-app'
import { GoogleRecaptchaAnchor } from './google.js'
import { googleRecaptchaAnchorSchema } from './google.schemas.js'

export const GOOGLE_CONTROLLER = Symbol('GoogleController')

export class GoogleController extends BaseController {
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

  static resolve(container: DIContainer): GoogleController {
    return container.resolve(GOOGLE_CONTROLLER)
  }

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

  pre() {
    this.router.addMiddleware('google-pre', async (ctx, next) => {
      const target = this.getState(ctx, 'target')

      const handler = this.dispatchPre[target.label]

      if (handler) {
        await handler(ctx, next)
      } else {
        await next()
      }
    })
  }

  private dispatchPre: Record<string, HttpServerMiddleware> = {
    'google-www': async (ctx, next) => {
      await next()
    },
  }

  act() {
    this.router.addMiddleware('google-act', async (ctx, next) => {
      const target = this.getState(ctx, 'target')

      const handler = this.dispatchAct[target.label]

      if (handler) {
        await handler(ctx, next)
      } else {
        await next()
      }
    })
  }

  private dispatchAct: Record<string, HttpServerMiddleware> = {
    'google-www': async (ctx, next) => {
      const targets = this.getState(ctx, 'targets')
      const message = this.getState(ctx, 'message')

      message
        .addRewriteUrlExtraSchemes()
        .addRewriteUrlContentTypes(['text/html', 'text/javascript'])
        .addRequestHeadInterceptor('google', () => {
          if (message.method.is('GET')) {
            if (message.url.isPath(/^\/recaptcha\/.+\/anchor$/)) {
              if (!message.status.isSuccess()) {
                throw new Error(`Unexpected response status`)
              }

              const urlParams = message.url.getQueryString()

              if (this.checkRecaptchaAnchor(urlParams)) {
                const oldHost = safeBase64Decode(urlParams.co).toString()
                const newHost = message.rewriteUrl(oldHost, true, targets)

                urlParams.co = safeBase64Encode(Buffer.from(newHost))

                message.url.setQueryString(urlParams)
              }
            }
          }
        })

      await next()
    },
  }

  protected checkRecaptchaAnchor(value: unknown): value is GoogleRecaptchaAnchor {
    return this.validator.guardSchema<GoogleRecaptchaAnchor>(
      'reverse-google-recaptcha-anchor',
      value
    )
  }
}
