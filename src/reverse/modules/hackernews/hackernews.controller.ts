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
import { HackernewsPayloadName } from './hackernews.js'

export const HACKERNEWS_CONTROLLER = Symbol('HackernewsController')

export class HackernewsController extends BaseController {
  static register(container: DIContainer) {
    container.registerSingleton<HackernewsController>(
      HACKERNEWS_CONTROLLER,
      (c) =>
        new HackernewsController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<Templater>(TEMPLATER),
          c.resolve<HttpServerAssets>(HTTP_SERVER_ASSETS),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): HackernewsController {
    return container.resolve(HACKERNEWS_CONTROLLER)
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
    this.router.addMiddleware('hackernews-pre', async (ctx, next) => {
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
    hackernews: async (ctx, next) => {
      const message = this.getState(ctx, 'message')

      if (ctx.method.is('POST')) {
        if (ctx.url.isPath('/logout')) {
          await this.sendMainRedirect(ctx)

          return
        }

        message.analyze ||= 'default'
      }

      await next()
    },
  }

  act() {
    this.router.addMiddleware('hackernews-act', async (ctx, next) => {
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
    hackernews: async (ctx, next) => {
      const message = this.getState(ctx, 'message')

      message
        .addRewriteUrlContentTypes(['text/html'])
        .addContentTypes('html', ['text/html'])
        .addContentTypes('urlEncoded', ['application/x-www-form-urlencoded'])
        .addRequestBodyInterceptor('hackernews', () => {
          if (message.method.is('POST')) {
            if (!message.isResponseContentType('urlEncoded')) {
              throw new Error(`Unexpected response content-type`)
            }

            const bodyParams = message.retrieveRequestBodyQueryString()

            let payloadName: HackernewsPayloadName
            if (message.url.isPath('/login')) {
              payloadName = 'hackernews_login'
            } else if (message.url.isPath('/comment')) {
              payloadName = 'hackernews_comment'
            } else if (message.url.isPath('/xuser')) {
              payloadName = 'hackernews_xuser'
            } else if (message.url.isPath('/xedit')) {
              payloadName = 'hackernews_xedit'
            } else if (message.url.isPath('/xdelete')) {
              payloadName = 'hackernews_xdelete'
            } else if (message.url.isPath('/r')) {
              payloadName = 'hackernews_r'
            } else {
              payloadName = 'hackernews_unknown'
            }

            message.payload[payloadName] = bodyParams
          }
        })
        .addResponseBodyInterceptor('hackernews', () => {
          if (message.method.is('GET')) {
            if (!message.isResponseContentType('html')) {
              throw new Error(`Unexpected response content-type`)
            }

            message.decorateResponseBodyHtml(($) => {
              $('.hnname > a:nth-child(1)').text('Fake Hacker News')
            })
          } else if (message.method.is('POST')) {
            message.payload['hackernews_okey'] = message.status.isRedirect()
          }
        })

      await next()
    },
  }
}
