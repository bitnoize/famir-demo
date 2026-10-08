import { DIContainer } from '@famir/common'
import { Logger, LOGGER, TEMPLATER, Templater, Validator, VALIDATOR } from '@famir/domain'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  HttpServerMiddleware,
  type HttpServerAssets,
  type HttpServerRouter,
} from '@famir/http-server'
import { BaseController } from '@famir/reverse-app'

export const JA3ZONE_CONTROLLER = Symbol('Ja3zoneController')

export class Ja3zoneController extends BaseController {
  static register(container: DIContainer) {
    container.registerSingleton<Ja3zoneController>(
      JA3ZONE_CONTROLLER,
      (c) =>
        new Ja3zoneController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<Templater>(TEMPLATER),
          c.resolve<HttpServerAssets>(HTTP_SERVER_ASSETS),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): Ja3zoneController {
    return container.resolve(JA3ZONE_CONTROLLER)
  }

  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    assets: HttpServerAssets,
    router: HttpServerRouter
  ) {
    super(validator, logger, templater, assets, router)
  }

  pre() {
    this.router.addMiddleware('ja3zone-pre', async (ctx, next) => {
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
    ja3zone: async (ctx, next) => {
      await next()
    },
  }

  act() {
    this.router.addMiddleware('ja3zone-act', async (ctx, next) => {
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
    ja3zone: async (ctx, next) => {
      const message = this.getState(ctx, 'message')

      message
        .addRewriteUrlContentTypes(['text/html', 'application/javascript'])
        .addContentTypes('html', ['text/html'])
        .addResponseBodyInterceptor('ja3zone', () => {
          if (message.method.is('GET')) {
            if (message.url.isPath(['/', '/check', '/info'])) {
              if (!message.status.isSuccess()) {
                throw new Error(`Unexpected response status`)
              }

              if (!message.isResponseContentType('html')) {
                throw new Error(`Unexpected response content-type`)
              }

              message.decorateResponseBodyHtml(($) => {
                $('script[src^=https://www.googletagmanager.com]').remove()
                $('script[src^=https://static.cloudflareinsights.com]').remove()

                $('link[rel=icon]').remove()
              })
            }
          }
        })

      await next()
    },
  }
}
